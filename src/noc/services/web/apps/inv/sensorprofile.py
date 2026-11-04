# ----------------------------------------------------------------------
# inv.sensorprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.sensorprofile import SensorProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class SensorProfileApplication(ExtDocApplication):
    """
    SensorProfile application
    """

    title = t("app-title-sensorprofile")
    menu = [t("app-group-setup"), t("nav-sensorprofile")]
    model = SensorProfile
