# ---------------------------------------------------------------------
# inv.firmwarepolicy application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.firmwarepolicy import FirmwarePolicy
from noc.services.web.base.extdocapplication import ExtDocApplication


class FirmwarePolicyApplication(ExtDocApplication):
    """
    FirmwarePolicy application
    """

    title = t("app-title-firmwarepolicy")
    menu = [t("app-group-setup"), t("nav-firmwarepolicy")]
    model = FirmwarePolicy
