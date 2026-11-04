# ---------------------------------------------------------------------
# main.reportsubscription application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.reportsubscription import ReportSubscription
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.services.web.base.site import site


class ReportSubscriptionApplication(ExtDocApplication):
    """
    ReportSubscription application
    """

    title = t("app-title-reportsubscription")
    menu = [t("app-group-setup"), t("nav-reportsubscription")]
    model = ReportSubscription

    def bulk_field_report_label(self, data):
        """
        Apply report_label field
        :return:
        """
        for x in data:
            x["report__label"] = self.get_reports_map()[x["report"]]
        return data

    def get_reports_map(self):
        if not hasattr(self, "_reports_map"):
            self._reports_map = {}
            for report_id, r in site.iter_predefined_reports():
                self._reports_map[report_id] = r.title
        return self._reports_map
