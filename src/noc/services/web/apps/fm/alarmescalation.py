# ---------------------------------------------------------------------
# fm.alarmescalation application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmescalation import AlarmEscalation
from noc.services.web.base.extdocapplication import ExtDocApplication


class AlarmEscalationApplication(ExtDocApplication):
    """
    AlarmEscalation application
    """

    title = t("app-title-alarmescalation")
    menu = [t("app-group-setup"), t("nav-alarmescalation")]
    model = AlarmEscalation
