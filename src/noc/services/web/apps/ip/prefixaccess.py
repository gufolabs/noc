# ---------------------------------------------------------------------
# ip.prefixaccess application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.ip.models.prefixaccess import PrefixAccess
from noc.services.web.base.extmodelapplication import ExtModelApplication


class PrefixAccessApplication(ExtModelApplication):
    """
    PrefixAccess application
    """

    title = t("app-title-prefixaccess")
    menu = [t("app-group-setup"), t("nav-prefixaccess")]
    model = PrefixAccess
    query_fields = ["user__username", "prefix"]
    query_condition = "icontains"
