# ----------------------------------------------------------------------
# vc.vpn application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.services.web.base.mixins.state import StateMixin
from noc.vc.models.vpn import VPN


class VPNApplication(StateMixin, ExtDocApplication):
    """
    VPN application
    """

    title = t("app-title-vpn")
    menu = [t("nav-vpn")]
    model = VPN
