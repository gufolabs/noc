# ---------------------------------------------------------------------
# cm.configurationscope application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.cm.models.configurationscope import ConfigurationScope
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication


class ConfigurationScopApplication(ExtDocApplication):
    """
    Configuration Scope application
    """

    title = t("app-title-configurationscope")
    menu = [t("app-group-setup"), t("nav-configurationscope")]
    model = ConfigurationScope
    query_fields = ["name__icontains"]
