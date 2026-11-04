# ---------------------------------------------------------------------
# sa.groupaccess application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.groupaccess import GroupAccess
from noc.services.web.base.extmodelapplication import ExtModelApplication


class GroupAccessApplication(ExtModelApplication):
    """
    GroupAccess application
    """

    title = t("app-title-groupaccess")
    menu = [t("app-group-setup"), t("nav-groupaccess")]
    model = GroupAccess
