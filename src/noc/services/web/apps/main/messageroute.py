# ----------------------------------------------------------------------
# main.messageroute application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.messageroute import MessageRoute
from noc.services.web.base.extdocapplication import ExtDocApplication


class MessageRouteApplication(ExtDocApplication):
    """
    MessageRoute application
    """

    title = t("app-title-messageroute")
    menu = [t("nav-messageroute")]
    model = MessageRoute
    glyph = "arrows-alt"
