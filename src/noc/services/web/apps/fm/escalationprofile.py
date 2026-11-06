# ---------------------------------------------------------------------
# fm.escalationprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.escalationprofile import EscalationProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class EscalationProfileApplication(ExtDocApplication):
    """
    EscalationProfile application
    """

    title = t("app-title-escalationprofile")
    menu = [t("app-group-setup"), t("nav-escalationprofile")]
    model = EscalationProfile
