# ----------------------------------------------------------------------
# peer.asprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.asprofile import ASProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class ASProfileApplication(ExtDocApplication):
    """
    ASProfile application
    """

    title = t("app-title-asprofile")
    menu = [t("app-group-setup"), t("nav-asprofile")]
    model = ASProfile
