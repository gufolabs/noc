# ----------------------------------------------------------------------
# inv.macblacklist application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.macblacklist import MACBlacklist
from noc.services.web.base.extdocapplication import ExtDocApplication


class MACBlacklistApplication(ExtDocApplication):
    """
    MACBlacklist application
    """

    title = t("app-title-macblacklist")
    menu = [t("app-group-setup"), t("nav-macblacklist")]
    model = MACBlacklist
