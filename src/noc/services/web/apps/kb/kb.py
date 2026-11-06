# ---------------------------------------------------------------------
# kb.card
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extapplication import ExtApplication


class KBApplication(ExtApplication):
    title = t("app-title-kb")
    menu = t("nav-kb")
    glyph = "dashboard"
    link = "/api/card/view/kb/0/"
