# ---------------------------------------------------------------------
# main.pyrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.pyrule import PyRule
from noc.services.web.base.extdocapplication import ExtDocApplication


class PyRuleApplication(ExtDocApplication):
    """
    PyRule application
    """

    title = t("app-title-pyrule")
    icon = "icon_py"
    menu = [t("app-group-setup"), t("nav-pyrule")]
    model = PyRule
    query_fields = ["name__icontains", "description__icontains", "source__icontains"]

    def field_full_name(self, o):
        return o.full_name
