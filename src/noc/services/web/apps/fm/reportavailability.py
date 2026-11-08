# ---------------------------------------------------------------------
# fm.reportavailability
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import datetime as dt
from collections import defaultdict

# Third-party modules
from django import forms
from mongoengine.queryset.visitor import Q
from pymongo import ReadPreference

# NOC modules
from noc.core.i18n import t
from noc.core.mongo.connection import get_db
from noc.fm.models.outage import Outage
from noc.fm.models.reboot import Reboot
from noc.inv.models.discoveryid import DiscoveryID
from noc.inv.models.interfaceprofile import InterfaceProfile
from noc.sa.models.administrativedomain import AdministrativeDomain
from noc.sa.models.managedobject import ManagedObject
from noc.sa.models.profile import Profile
from noc.sa.models.useraccess import UserAccess
from noc.services.web.base.simplereport import PredefinedReport, SectionRow, SimpleReport


class ReportForm(forms.Form):
    from_date = forms.CharField(
        widget=forms.TextInput(attrs={"type": "date"}), label=t("label-from-date"), required=True
    )
    to_date = forms.CharField(
        widget=forms.TextInput(attrs={"type": "date"}), label=t("label-to-date"), required=False
    )
    adm_domain = forms.ModelChoiceField(
        label=t("label-administrative-domain"),
        required=False,
        queryset=AdministrativeDomain.objects.order_by("name"),
    )
    skip_avail = forms.BooleanField(label=t("status-skip-full-available"), required=False)
    skip_zero_avail = forms.BooleanField(label=t("status-skip-zero-available"), required=False)
    filter_zero_access = forms.BooleanField(label=t("status-skip-zero-access-port"), required=False)


class ReportAvailabilityApplication(SimpleReport):
    title = t("app-title-reportavailability")
    form = ReportForm
    predefined_reports = {
        "1d": PredefinedReport(t("title-availability-last-day"), {"interval": 1}),
        "7d": PredefinedReport(t("title-availability-last-week"), {"interval": 7}),
        "30d": PredefinedReport(t("title-availability-last-month"), {"interval": 30}),
    }

    @staticmethod
    def get_availability_interval(days):
        now = dt.datetime.now()
        d = dt.timedelta(days=days)
        b = now - d
        outages = defaultdict(int)
        q = Q(start__gte=b) | Q(stop__gte=b) | Q(stop__exists=False)
        for o in Outage.objects.filter(q).read_preference(ReadPreference.SECONDARY_PREFERRED):
            start = max(o.start, b)
            stop = o.stop if o.stop else now
            outages[o.object] += (stop - start).total_seconds()
        td = d.total_seconds()  # Normalize to percents
        return {o: (td - outages[o]) * 100.0 / td for o in outages}

    @staticmethod
    def get_availability(start_date, stop_date, skip_zero_avail=False):
        # now = datetime.datetime.now()
        b = start_date
        d = stop_date
        outages = defaultdict(list)
        td = (d - b).total_seconds()
        # q = Q(start__gte=b) | Q(stop__gte=b) | Q(stop__exists=False)
        q = (Q(start__gte=b) | Q(stop__gte=b) | Q(stop__exists=False) | Q(stop__exists=None)) & Q(
            start__lt=d
        )
        for o in Outage.objects.filter(q):
            start = max(o.start, b)
            stop = o.stop if (o.stop and o.stop < d) else d
            if (stop - start).total_seconds() == td and skip_zero_avail:
                continue
            outages[o.object].append((stop - start).total_seconds())
        # Normalize to percents
        return {
            o: ((td - sum(outages[o])) * 100.0 / td, int(sum(outages[o])), len(outages[o]))
            for o in outages
        }

    @staticmethod
    def get_reboots(start_date=None, stop_date=None):
        match = {"ts": {"$gte": start_date, "$lte": stop_date}}
        pipeline = [
            {"$match": match},
            {"$group": {"_id": "$object", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        data = (
            Reboot._get_collection()
            .with_options(read_preference=ReadPreference.SECONDARY_PREFERRED)
            .aggregate(pipeline)
        )
        # data = data["result"]
        return {rb["_id"]: rb["count"] for rb in data}

    def get_data(
        self,
        request,
        interval=1,
        from_date=None,
        to_date=None,
        adm_domain=None,
        skip_avail=False,
        skip_zero_avail=False,
        filter_zero_access=False,
        **kwargs,
    ):
        """
        a1 = self.get_availability(1)
        a7 = self.get_availability(7)
        a30 = self.get_availability(30)
        """

        if not from_date:
            from_date = dt.datetime.now() - dt.timedelta(days=interval)
        else:
            from_date = dt.datetime.strptime(from_date, self.ISO_DATE_MASK)

        if not to_date or from_date == to_date:
            to_date = from_date + dt.timedelta(days=1)
        else:
            to_date = dt.datetime.strptime(to_date, self.ISO_DATE_MASK) + dt.timedelta(days=1)

        a = self.get_availability(
            start_date=from_date, stop_date=to_date, skip_zero_avail=skip_zero_avail
        )
        rb = self.get_reboots(start_date=from_date, stop_date=to_date)
        r = [SectionRow(f"Report from {from_date} to {to_date}")]
        mos = ManagedObject.objects.filter(is_managed=True)

        if not request.user.is_superuser:
            mos = mos.filter(administrative_domain__in=UserAccess.get_domains(request.user))
        if adm_domain:
            mos = mos.filter(administrative_domain__in=adm_domain.get_nested())
        if skip_avail:
            mos = mos.filter(id__in=list(a))
        mos_id = list(mos.order_by("id").values_list("id", flat=True))
        if filter_zero_access:
            iface_p = InterfaceProfile.objects.get(name="Клиентский порт")
            match = {"profile": iface_p.id, "managed_object": {"$in": mos_id}}
            pipeline = [
                {"$match": match},
                {
                    "$group": {
                        "_id": "$managed_object",
                        "count": {"$sum": 1},
                        "m": {"$max": "$oper_status"},
                    }
                },
                {"$match": {"m": False}},
                {"$project": {"_id": True}},
            ]
            # data = Interface.objects._get_collection().aggregate(pipeline,
            data = (
                get_db()["noc.interfaces"]
                .with_options(read_preference=ReadPreference.SECONDARY_PREFERRED)
                .aggregate(pipeline)
            )
            data = [d["_id"] for d in data]
            mos = mos.exclude(id__in=data)

        mo_hostname = {
            val["object"]: val["hostname"]
            for val in DiscoveryID._get_collection()
            .with_options(read_preference=ReadPreference.SECONDARY_PREFERRED)
            .find({"hostname": {"$exists": 1}}, {"object": 1, "hostname": 1})
        }
        for mo_id, mo_name, address, profile, ad_name in mos.values_list(
            "id", "name", "address", "profile", "administrative_domain__name"
        ):
            s = [
                ad_name,
                mo_name,
                mo_hostname.get(mo_id, ""),
                address,
                Profile.get_by_id(profile).name,
                round(a.get(mo_id, (100.0, 0, 0))[0], 2),
            ]
            s.extend(a.get(mo_id, (100.0, 0, 0))[1:])
            s.append(rb.get(mo_id, 0))
            r.append(s)
            """
            a1.get(o.id, 100),
            a7.get(o.id, 100),
            a30.get(o.id, 100)
            """
        # print r
        return self.from_dataset(
            title=self.title,
            columns=[
                t("header-adm-domain"),
                t("header-managed-object-62561c"),
                t("header-hostname"),
                t("header-address"),
                t("header-profile"),
                # TableColumn(_("Avail"), align="right", format="percent"),
                # TableColumn(_("Total avail (sec)"), align="right", format="numeric"),
                t("header-avail-389d90"),
                t("header-total-unavail-sec"),
                t("header-count-outages"),
                t("header-reboots"),
            ],
            data=r,
            enumerate=True,
        )
