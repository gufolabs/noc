# ---------------------------------------------------------------------
# fm.alarmtrigger application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmtrigger import AlarmTrigger
from noc.services.web.base.extmodelapplication import ExtModelApplication


class AlarmTriggerApplication(ExtModelApplication):
    """
    AlarmTrigger application
    """

    title = t("app-title-alarmtrigger")
    menu = [t("app-group-setup"), t("nav-alarmtrigger")]
    model = AlarmTrigger
