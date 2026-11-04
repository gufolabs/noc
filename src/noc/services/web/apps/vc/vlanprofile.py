# ----------------------------------------------------------------------
# vc.vlanprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.vc.models.vlanprofile import VLANProfile


class VLANProfileApplication(ExtDocApplication):
    """
    VLANProfile application
    """

    title = t("app-title-vlanprofile")
    menu = [t("app-group-setup"), t("nav-vlanprofile")]
    model = VLANProfile
