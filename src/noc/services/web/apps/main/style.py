# ---------------------------------------------------------------------
# main.style application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.main.models.style import Style
from noc.sa.interfaces.base import ColorParameter
from noc.services.web.base.extmodelapplication import ExtModelApplication, api


class StyleApplication(ExtModelApplication):
    """
    Style application
    """

    title = t("app-title-style")
    menu = [t("app-group-setup"), t("nav-style")]
    model = Style
    icon = "icon_style"

    clean_fields = {"background_color": ColorParameter(), "font_color": ColorParameter()}

    @api.get("^scheme/$", access=True)
    def api_style(self, request: HttpRequest):
        return Style.get_scheme()
