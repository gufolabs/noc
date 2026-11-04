# ---------------------------------------------------------------------
# maintenance.maintenancetype application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.maintenance.models.maintenancetype import MaintenanceType
from noc.services.web.base.extdocapplication import ExtDocApplication


class MaintenanceTypeApplication(ExtDocApplication):
    """
    MaintenanceType application
    """

    title = t("app-title-maintenancetype")
    menu = [t("app-group-setup"), t("nav-maintenancetype")]
    model = MaintenanceType
