# ---------------------------------------------------------------------
# cm.configurationparam application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.cm.models.configurationparam import ConfigurationParam
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication


class SupplierApplication(ExtDocApplication):
    """
    Configuration Param application
    """

    title = t("app-title-configurationparam")
    menu = [t("nav-configurationparam")]
    model = ConfigurationParam
    query_fields = ["name__icontains"]
