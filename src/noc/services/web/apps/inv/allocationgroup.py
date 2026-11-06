# ----------------------------------------------------------------------
# inv.allocationgroup application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.allocationgroup import AllocationGroup
from noc.services.web.base.extdocapplication import ExtDocApplication


class AllocationGroupApplication(ExtDocApplication):
    """
    AllocationGroup application
    """

    title = t("app-title-allocationgroup")
    menu = [t("app-group-setup"), t("nav-allocationgroup")]
    model = AllocationGroup
