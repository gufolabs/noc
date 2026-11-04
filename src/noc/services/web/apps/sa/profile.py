# ----------------------------------------------------------------------
# sa.profile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.profile import Profile
from noc.services.web.base.extdocapplication import ExtDocApplication


class ProfileApplication(ExtDocApplication):
    """
    Profile application
    """

    title = t("app-title-profile")
    menu = [t("app-group-setup"), t("nav-profile")]
    model = Profile
    query_fields = ["name__icontains", "description__icontains"]
    default_ordering = ["name"]
