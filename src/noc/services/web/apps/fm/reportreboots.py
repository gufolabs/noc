# ---------------------------------------------------------------------
# fm.reportreboots
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import datetime as dt

# Third-party modules
from django import forms
from django.db import connection
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.fm.models.reboot import Reboot
from noc.sa.models.managedobject import ManagedObject
from noc.sa.models.useraccess import UserAccess
from noc.services.web.base.simplereport import PredefinedReport, SimpleReport, TableColumn


class ReportForm(forms.Form):
    interval = forms.ChoiceField(
        choices=[
            (0, t("label-range")),
            (1, t("label-1-day")),
            (7, t("label-1-week")),
            (30, t("label-1-month")),
        ],
        label=t("label-interval"),
    )
    from_date = forms.CharField(
        widget=forms.TextInput(attrs={"type": "date"}), label=t("label-from-date"), required=False
    )
    to_date = forms.CharField(
        widget=forms.TextInput(attrs={"type": "date"}), label=t("label-to-date"), required=False
    )


class ReportRebootsApplication(SimpleReport):
    title = t("app-title-reportreboots")
    form = ReportForm
    predefined_reports = {
        "1d": PredefinedReport(t("label-reboots-1-day"), {"interval": 1}),
        "7d": PredefinedReport(t("label-reboots-7-days"), {"interval": 7}),
        "30d": PredefinedReport(t("label-reboot-30-day"), {"interval": 30}),
    }

    def get_data(self, request: HttpRequest, interval, from_date=None, to_date=None, **kwargs):
        interval = int(interval)
        if not from_date:
            interval = 1
        if interval:
            ts = dt.datetime.now() - dt.timedelta(days=interval)
            match = {"ts": {"$gte": ts}}
        else:
            t0 = dt.datetime.strptime(from_date, self.ISO_DATE_MASK)
            if not to_date:
                t1 = dt.datetime.now()
            else:
                t1 = dt.datetime.strptime(to_date, self.ISO_DATE_MASK) + dt.timedelta(days=1)
            match = {"ts": {"$gte": t0, "$lte": t1}}
        pipeline = [
            {"$match": match},
            {"$group": {"_id": "$object", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        data = list(Reboot._get_collection().aggregate(pipeline))
        # Get managed objects
        if not request.user.is_superuser:
            id_perm = [
                mo.id
                for mo in ManagedObject.objects.filter(
                    administrative_domain__in=UserAccess.get_domains(request.user)
                )
            ]
            ids = [x["_id"] for x in data if x["_id"] in id_perm]
        else:
            ids = [x["_id"] for x in data]
        mo_names = {}  # mo id -> mo name
        cursor = connection.cursor()
        while ids:
            chunk = [str(x) for x in ids[:500]]
            ids = ids[500:]
            cursor.execute(
                """
                SELECT id, address, name
                FROM sa_managedobject
                WHERE id IN ({})""".format(", ".join(chunk))
            )
            mo_names.update({c[0]: c[1:3] for c in cursor})
        if not request.user.is_superuser:
            data = [
                (mo_names.get(x["_id"], "---")[1], mo_names.get(x["_id"], "---")[0], x["count"])
                for x in data
                if x["_id"] in id_perm
            ]
        else:
            data = [
                (mo_names.get(x["_id"], "---")[1], mo_names.get(x["_id"], "---")[0], x["count"])
                for x in data
            ]

        return self.from_dataset(
            title=self.title,
            columns=[
                t("header-managed-object-62561c"),
                t("header-address"),
                TableColumn(t("header-reboots"), align="right", format="numeric", total="sum"),
            ],
            data=data,
            enumerate=True,
        )
