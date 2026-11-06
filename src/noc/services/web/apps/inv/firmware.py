# ---------------------------------------------------------------------
# inv.firmware application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.firmware import Firmware
from noc.services.web.base.extdocapplication import ExtDocApplication


class FirmwareApplication(ExtDocApplication):
    """
    Firmware application
    """

    title = t("app-title-firmware")
    menu = [t("app-group-setup"), t("nav-firmware")]
    model = Firmware
    query_fields = ["full_name__icontains", "version__icontains"]
    default_ordering = ["full_name"]
