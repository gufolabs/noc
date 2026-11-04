# ----------------------------------------------------------------------
# pm.measurementunits application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.measurementunits import MeasurementUnits
from noc.sa.interfaces.base import ColorParameter
from noc.services.web.base.extdocapplication import ExtDocApplication


class MeasurementUnitsApplication(ExtDocApplication):
    """
    MeasurementUnits application
    """

    title = t("app-title-measurementunits")
    menu = [t("app-group-setup"), t("nav-measurementunits")]
    model = MeasurementUnits

    clean_fields = {"dashboard_sr_color": ColorParameter()}
