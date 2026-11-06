# ---------------------------------------------------------------------
# fm.alarmdiagnosticconfig application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmdiagnosticconfig import AlarmDiagnosticConfig
from noc.services.web.base.extdocapplication import ExtDocApplication


class AlarmDiagnosticConfigApplication(ExtDocApplication):
    """
    AlarmDiagnosticConfig application
    """

    title = t("app-title-alarmdiagnosticconfig")
    menu = [t("app-group-setup"), t("nav-alarmdiagnosticconfig")]
    model = AlarmDiagnosticConfig
