# ----------------------------------------------------------------------
# pm.scale application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.scale import Scale
from noc.services.web.base.extdocapplication import ExtDocApplication


class ScaleApplication(ExtDocApplication):
    """
    Scale application
    """

    title = t("app-title-scale")
    menu = [t("app-group-setup"), t("nav-scale")]
    model = Scale
    query_condition = "icontains"
    query_fields = ["name", "description"]
