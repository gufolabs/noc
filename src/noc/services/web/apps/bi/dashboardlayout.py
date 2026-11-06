# ---------------------------------------------------------------------
# bi.dashboardlayout application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.bi.models.dashboardlayout import DashboardLayout
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication, api


class DashboardLayoutApplication(ExtDocApplication):
    """
    DashboardLayout application
    """

    title = t("app-title-dashboardlayout")
    menu = [t("app-group-setup"), t("nav-dashboardlayout")]
    model = DashboardLayout

    @api.get("^(?P<id>[0-9a-f]{24})/json/$", access="read")
    def api_json(self, request: HttpRequest, id):
        layout = self.get_object_or_404(DashboardLayout, id=id)
        return layout.to_json()
