# ---------------------------------------------------------------------
# inv.card
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extapplication import ExtApplication


class BIDashboardApplication(ExtApplication):
    title = t("app-title-dashboard")
    menu = t("nav-dashboard")
    glyph = "dashboard"
    link = "/ui/bi2/"
