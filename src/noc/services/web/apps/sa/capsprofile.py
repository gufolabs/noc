# ----------------------------------------------------------------------
# sa.capsprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.capsprofile import CapsProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class CapsProfileApplication(ExtDocApplication):
    """
    CapsProfile application
    """

    title = t("app-title-capsprofile")
    menu = [t("app-group-setup"), t("nav-capsprofile")]
    model = CapsProfile
