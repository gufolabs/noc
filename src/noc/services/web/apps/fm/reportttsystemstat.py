# ----------------------------------------------------------------------
# fm.reportettsystemstat
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime as dt
import time

# Third-party modules
from django import forms
from django.forms import widgets
from django.http import HttpRequest

# NOC modules
from noc.core.clickhouse.connect import connection
from noc.core.i18n import t
from noc.fm.models.archivedalarm import ArchivedAlarm
from noc.fm.models.ttsystem import TTSystem
from noc.sa.models.managedobject import ManagedObject
from noc.services.web.base.simplereport import PredefinedReport, SectionRow, SimpleReport


class ReportForm(forms.Form):
    repo_format = forms.ChoiceField(
        label=t("label-report-format"),
        widget=widgets.RadioSelect,
        choices=((0, t("label-statistics")), (1, t("label-escalation-error-details"))),
        initial=0,
        required=False,
    )
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


class ReportTTSystemStatApplication(SimpleReport):
    title = t("app-title-reportttsystemstat")
    form = ReportForm
    predefined_reports = {
        "1d": PredefinedReport(t("label-ttsystem-stat-1-day"), {"interval": 1}),
        "7d": PredefinedReport(t("label-ttsystem-stat-7-days"), {"interval": 7}),
        "30d": PredefinedReport(t("label-ttsystem-stat-30-day"), {"interval": 30}),
        "1d_errors": PredefinedReport(
            t("label-ttsystem-errors-1-day"), {"interval": 1, "repo_format": "1"}
        ),
    }

    def get_data(
        self,
        request: HttpRequest,
        interval=1,
        repo_format=0,
        from_date=None,
        to_date=None,
        **kwargs,
    ):
        # Date Time Block
        if from_date:
            from_date = dt.datetime.strptime(from_date, self.ISO_DATE_MASK)
        elif interval:
            from_date = dt.datetime.now() - dt.timedelta(days=int(interval))
        else:
            from_date = dt.datetime.now() - dt.timedelta(days=1)

        if to_date:
            to_date = dt.datetime.strptime(to_date, self.ISO_DATE_MASK)
            if from_date == to_date:
                to_date = from_date + dt.timedelta(days=1)
        elif interval:
            to_date = from_date + dt.timedelta(days=int(interval))
        else:
            to_date = from_date + dt.timedelta(days=1)
        columns = [
            t("header-server"),
            t("header-service"),
            t("header-request-count"),
            t("header-success-request-count"),
            t("header-failed-request-count"),
            t("header-success-request"),
            t("header-q1-ms"),
            t("header-q2-ms"),
            t("header-q3-ms"),
            t("header-p95-ms"),
            t("header-max-ms"),
        ]
        if repo_format == "1":
            columns = [
                t("header-timestamp"),
                t("header-server"),
                t("header-service"),
                t("header-managed-object-62561c"),
                t("header-tt-id"),
                t("header-error-code"),
                t("header-error-text"),
            ]
        ts_from_date = time.mktime(from_date.timetuple())
        ts_to_date = time.mktime(to_date.timetuple())

        tt_systems = TTSystem.objects.filter().scalar("name")
        # Manged Object block

        q1 = """select server, service, count(), round(quantile(0.25)(duration), 0)/1000 as q1,
                                        round(quantile(0.5)(duration), 0)/1000 as q2,
                                        round(quantile(0.75)(duration), 0)/1000 as q3,
                                        round(quantile(0.95)(duration),0)/1000 as p95,
                                        round(max(duration),0)/1000 as max from span where %s
                                        group by server, service"""

        q2 = """select server, service, error_code, count(), avg(duration)
                from span where %s group by server, service, error_code"""

        q3 = """select ts, server, service, in_label, in_label, error_code, error_text from span
                where service IN ('create_massive_damage_outer', 'change_massive_damage_outer_close') and
                      error_code <> 0 and %s"""

        q_where = ["server IN ('{}')".format("', '".join(tt_systems))]
        # q_where = ["managed_object IN (%s)" % ", ".join(mo_bi_dict.keys())]
        q_where.append(
            f"(date >= toDate({ts_from_date})) AND (ts >= toDateTime({ts_from_date}) "
            f"AND ts <= toDateTime({ts_to_date}))"
        )
        r = []
        ch = connection()
        if repo_format == "1":
            aa = {
                aa.escalation_tt.split(":")[-1]: aa
                for aa in ArchivedAlarm.objects.filter(
                    clear_timestamp__gte=from_date,
                    clear_timestamp__lte=to_date,
                    escalation_tt__exists=True,
                )
            }
            query = q3 % " and ".join(q_where)
            for row in ch.execute(query):
                if row[2] in ["create_massive_damage_outer"]:
                    row[2] = "Создание ТТ"
                    try:
                        row[3] = ManagedObject.objects.get(tt_system_id=int(row[3]))
                        row[4] = ""
                    except ManagedObject.DoesNotExist:
                        pass
                    except ManagedObject.MultipleObjectsReturned:
                        row[3] = ManagedObject.objects.get(
                            tt_system_id=int(row[3]), is_managed=True
                        )
                        row[4] = ""
                elif row[2] in ["change_massive_damage_outer_close"]:
                    row[2] = "Закрытие ТТ"
                    row[4] = row[3]
                    row[3] = aa[row[3]].managed_object if row[3] in aa else row[3]
                else:
                    continue
                r.append(row)
        else:
            query = q1 % " and ".join(q_where)
            # (server, service)
            tt_s = {}
            for row in ch.execute(query):
                tt_s[(row[0], row[1])] = [row[2], 0, 0, 0, *row[3:]]
            query = q2 % " and ".join(q_where)
            for row in ch.execute(query):
                if row[2] == "0":
                    tt_s[(row[0], row[1])][1] = row[3]
                else:
                    tt_s[(row[0], row[1])][2] += int(row[3])

            r.append(
                SectionRow(
                    name=f"Report from {from_date.strftime('%d.%m.%Y %H:%M')} to {to_date.strftime('%d.%m.%Y %H:%M')}"
                )
            )
            for line in sorted(tt_s, key=lambda x: x[0]):
                data = list(line)
                data += tt_s[line]
                data[5] = round((float(data[3]) / float(data[2])) * 100.0, 2)
                r.append(data)

        return self.from_dataset(title=self.title, columns=columns, data=r, enumerate=True)
