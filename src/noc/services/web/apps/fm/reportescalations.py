# ----------------------------------------------------------------------
#  fm.reportescalations
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime as dt
import operator

# Third-party modules
from django import forms
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.fm.models.activealarm import ActiveAlarm
from noc.fm.models.archivedalarm import ArchivedAlarm
from noc.sa.models.managedobject import ManagedObject
from noc.sa.models.useraccess import UserAccess
from noc.services.web.base.simplereport import PredefinedReport, SimpleReport


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


class ReportEscalationsApplication(SimpleReport):
    title = t("app-title-reportescalations")
    form = ReportForm
    predefined_reports = {
        "1d": PredefinedReport(t("label-escalations-1-day"), {"interval": 1}),
        "7d": PredefinedReport(t("label-escalations-7-days"), {"interval": 7}),
        "30d": PredefinedReport(t("label-escalations-30-day"), {"interval": 30}),
    }

    def get_data(self, request: HttpRequest, interval, from_date=None, to_date=None, **kwargs):
        interval = int(interval)
        if not from_date:
            interval = 1
        if interval:
            ts = dt.datetime.now() - dt.timedelta(days=interval)
            q = {"timestamp": {"$gte": ts}}
        else:
            t0 = dt.datetime.strptime(from_date, self.ISO_DATE_MASK)
            if not to_date:
                t1 = dt.datetime.now()
            else:
                t1 = dt.datetime.strptime(to_date, self.ISO_DATE_MASK) + dt.timedelta(days=1)
            q = {"timestamp": {"$gte": t0, "$lte": t1}}
        q["escalation_tt"] = {"$exists": True}
        if not request.user.is_superuser:
            q["adm_path"] = {"$in": UserAccess.get_domains(request.user)}
        data = []
        for ac in (ActiveAlarm, ArchivedAlarm):
            for d in ac._get_collection().find(q):
                mo = ManagedObject.get_by_id(d["managed_object"])
                if not mo:
                    continue
                data.append(
                    (
                        d["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                        d["escalation_ts"].strftime("%Y-%m-%d %H:%M:%S"),
                        mo.name.split("#", 1)[0],
                        mo.address,
                        mo.platform,
                        mo.segment.name,
                        d["escalation_tt"],
                        sum(ss["summary"] for ss in d["total_objects"]),
                        sum(ss["summary"] for ss in d["total_subscribers"]),
                    )
                )
        data = sorted(data, key=operator.itemgetter(0))
        return self.from_dataset(
            title=self.title,
            columns=[
                t("header-timestamp"),
                t("header-escalation-timestamp"),
                t("header-managed-object-62561c"),
                t("header-address"),
                t("header-platform"),
                t("header-segment-44986c"),
                t("header-tt"),
                t("header-objects-72a83a"),
                t("header-subscribers-6f13df"),
            ],
            data=data,
            enumerate=True,
        )
