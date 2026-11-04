# ---------------------------------------------------------------------
# fm.eventtrigger application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.eventtrigger import EventTrigger
from noc.services.web.base.extmodelapplication import ExtModelApplication


class EventTriggerApplication(ExtModelApplication):
    """
    EventTrigger application
    """

    title = t("app-title-eventtrigger")
    menu = [t("app-group-setup"), t("nav-eventtrigger")]
    model = EventTrigger
