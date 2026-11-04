# ----------------------------------------------------------------------
# inv.networksegmentprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.networksegmentprofile import NetworkSegmentProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class NetworkSegmentProfileApplication(ExtDocApplication):
    """
    NetworkSegmentProfile application
    """

    title = t("app-title-networksegmentprofile")
    menu = [t("app-group-setup"), t("nav-networksegmentprofile")]
    model = NetworkSegmentProfile
