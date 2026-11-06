# ---------------------------------------------------------------------
# fm.alarmrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmrule import AlarmRule
from noc.services.web.base.extdocapplication import ExtDocApplication


class AlarmRuleApplication(ExtDocApplication):
    """
    AlarmGroup application
    """

    title = t("app-title-alarmrule")
    menu = [t("app-group-setup"), t("nav-alarmrule")]
    model = AlarmRule
