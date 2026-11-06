# ----------------------------------------------------------------------
# pm.agentprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.agentprofile import AgentProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class AgentProfileApplication(ExtDocApplication):
    """
    AgentProfile application
    """

    title = t("app-title-agentprofile")
    menu = [t("app-group-setup"), t("nav-agentprofile")]
    model = AgentProfile
