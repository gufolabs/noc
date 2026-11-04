# ---------------------------------------------------------------------
# sa.action application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.action import Action
from noc.services.web.base.extdocapplication import ExtDocApplication


class ActionApplication(ExtDocApplication):
    """
    Action application
    """

    title = t("app-title-action")
    menu = [t("app-group-setup"), t("nav-action")]
    model = Action
