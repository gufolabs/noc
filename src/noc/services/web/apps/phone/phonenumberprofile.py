# ---------------------------------------------------------------------
# phone.phonenumberprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.phone.models.phonenumberprofile import PhoneNumberProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class PhoneNumberProfileApplication(ExtDocApplication):
    """
    PhoneNumberProfile application
    """

    title = t("app-title-phonenumberprofile")
    menu = [t("app-group-setup"), t("nav-phonenumberprofile")]
    model = PhoneNumberProfile
