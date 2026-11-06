# ---------------------------------------------------------------------
# fm.ttsystem application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.ttsystem import TTSystem
from noc.services.web.base.extdocapplication import ExtDocApplication


class TTSystemApplication(ExtDocApplication):
    """
    TTSystem application
    """

    title = t("app-title-ttsystem")
    menu = [t("app-group-setup"), t("nav-ttsystem")]
    model = TTSystem
