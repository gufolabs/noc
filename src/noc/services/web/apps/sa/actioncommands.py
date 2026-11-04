# ---------------------------------------------------------------------
# sa.actioncommands application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
import jinja2

# NOC modules
from noc.core.i18n import t
from noc.sa.models.actioncommands import ActionCommands
from noc.services.web.base.extdocapplication import ExtDocApplication


class ActionCommandsApplication(ExtDocApplication):
    """
    ActionCommands application
    """

    title = t("app-title-actioncommands")
    menu = [t("app-group-setup"), t("nav-actioncommands")]
    model = ActionCommands

    def clean(self, data):
        data = super().clean(data)
        try:
            jinja2.Template(data["commands"])
        except Exception as e:
            raise ValueError("Invalid template: %s", e)
        return data
