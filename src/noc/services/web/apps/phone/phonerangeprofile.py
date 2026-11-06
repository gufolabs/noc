# ---------------------------------------------------------------------
# phone.phonerangeprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.phone.models.phonerangeprofile import PhoneRangeProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class PhoneRangeProfileApplication(ExtDocApplication):
    """
    PhoneRangeProfile application
    """

    title = t("app-title-phonerangeprofile")
    menu = [t("app-group-setup"), t("nav-phonerangeprofile")]
    model = PhoneRangeProfile
