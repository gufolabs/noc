# ---------------------------------------------------------------------
# sa.authprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.authprofile import AuthProfile
from noc.services.web.base.extmodelapplication import ExtModelApplication


class AuthProfileApplication(ExtModelApplication):
    """
    AuthProfile application
    """

    title = t("app-title-authprofile")
    menu = [t("app-group-setup"), t("nav-authprofile")]
    model = AuthProfile
