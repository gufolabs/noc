# ----------------------------------------------------------------------
# ip.addressprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.ip.models.addressprofile import AddressProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class AddressProfileApplication(ExtDocApplication):
    """
    AddressProfile application
    """

    title = t("app-title-addressprofile")
    menu = [t("app-group-setup"), t("nav-addressprofile")]
    model = AddressProfile
    implied_permissions = {"launch": ["main:template:lookup"]}
