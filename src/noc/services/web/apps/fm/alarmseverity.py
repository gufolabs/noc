# ---------------------------------------------------------------------
# fm.alarmseverity application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmseverity import AlarmSeverity
from noc.services.web.base.extdocapplication import ExtDocApplication


class AlarmSeverityApplication(ExtDocApplication):
    """
    AlarmSeverity application
    """

    title = t("app-title-alarmseverity")
    menu = [t("app-group-setup"), t("nav-alarmseverity")]
    model = AlarmSeverity
