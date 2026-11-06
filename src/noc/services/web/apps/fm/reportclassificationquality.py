# ---------------------------------------------------------------------
# Classification Quality Report
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.fm.models.activeevent import ActiveEvent
from noc.fm.models.eventclass import EventClass
from noc.services.web.base.simplereport import SimpleReport, TableColumn


class ReportClassificationQuality(SimpleReport):
    title = t("app-title-reportclassificationquality")

    def get_data(self, request: HttpRequest, **kwargs):
        default_ids = [c.id for c in EventClass.objects.filter(name__startswith="Unknown | ")]
        count = ActiveEvent.objects.count()
        not_classified = ActiveEvent.objects.filter(event_class__in=default_ids).count()
        classified = count - not_classified
        quality = classified * 100 / count if count else 100
        data = [["Active Events", classified, count, quality]]
        return self.from_dataset(
            title=self.title,
            columns=[
                "",
                TableColumn(t("header-classified"), format="integer", align="right"),
                TableColumn(t("header-total"), format="integer", align="right"),
                TableColumn(t("header-quality"), format="percent", align="right"),
            ],
            data=data,
        )
