# ---------------------------------------------------------------------
# fm.totaloutage
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.config import config
from noc.core.i18n import t
from noc.services.web.base.extapplication import ExtApplication


class TotalOutageApplication(ExtApplication):
    title = t("app-title-totaloutage")
    menu = t("nav-totaloutage")
    glyph = "bolt"
    link = f"/api/card/view/totaloutage/1/?refresh={config.fm.total_outage_refresh}"
