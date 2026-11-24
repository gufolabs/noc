# ----------------------------------------------------------------------
# pm.agent application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.agent import Agent
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.services.web.base.mixins.state import StateMixin


class AgentApplication(StateMixin, ExtDocApplication):
    """
    Agent application
    """

    title = t("app-title-agent")
    menu = [t("app-group-setup"), t("nav-agent")]
    model = Agent
