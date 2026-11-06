# ---------------------------------------------------------------------
# fm.totaloutage
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extapplication import ExtApplication


class MonmapApplication(ExtApplication):
    title = t("app-title-monmap")
    menu = t("nav-monmap")
    glyph = "globe"
    link = "/api/card/view/monmap/1/"
