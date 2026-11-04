# ---------------------------------------------------------------------
# sa.useraccess application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.useraccess import UserAccess
from noc.services.web.base.extmodelapplication import ExtModelApplication


class UserAccessApplication(ExtModelApplication):
    """
    UserAccess application
    """

    title = t("app-title-useraccess")
    menu = [t("app-group-setup"), t("nav-useraccess")]
    model = UserAccess
