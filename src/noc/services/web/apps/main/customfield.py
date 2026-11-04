# ---------------------------------------------------------------------
# main.customfield application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.customfield import CustomField
from noc.services.web.base.extmodelapplication import ExtModelApplication


class CustomFieldApplication(ExtModelApplication):
    """
    CustomField application
    """

    title = t("app-title-customfield")
    menu = [t("app-group-setup"), t("nav-customfield")]
    model = CustomField
    icon = "icon_cog_add"
    query_fields = ["name", "description", "table"]

    def field_table__label(self, obj):
        return obj.table
