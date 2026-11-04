# ---------------------------------------------------------------------
# fm.alarmclassconfig application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmclassconfig import AlarmClassConfig
from noc.services.web.base.extdocapplication import ExtDocApplication


class AlarmClassConfigApplication(ExtDocApplication):
    """
    AlarmClassConfig application
    """

    title = t("app-title-alarmclassconfig")
    menu = [t("app-group-setup"), t("nav-alarmclassconfig")]
    model = AlarmClassConfig
