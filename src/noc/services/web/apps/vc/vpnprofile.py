# ----------------------------------------------------------------------
# vc.vpnprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.vc.models.vpnprofile import VPNProfile


class VPNProfileApplication(ExtDocApplication):
    """
    VPNProfile application
    """

    title = t("app-title-vpnprofile")
    menu = [t("app-group-setup"), t("nav-vpnprofile")]
    model = VPNProfile
