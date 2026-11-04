# ----------------------------------------------------------------------
# ip.prefixprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.ip.models.prefixprofile import PrefixProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class PrefixProfileApplication(ExtDocApplication):
    """
    PrefixProfile application
    """

    title = t("app-title-prefixprofile")
    menu = [t("app-group-setup"), t("nav-prefixprofile")]
    model = PrefixProfile
