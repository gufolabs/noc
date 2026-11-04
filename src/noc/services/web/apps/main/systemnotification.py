# ---------------------------------------------------------------------
# main.systemnotification application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.systemnotification import SystemNotification
from noc.services.web.base.extmodelapplication import ExtModelApplication


class SystemNotificationApplication(ExtModelApplication):
    """
    SystemNotification application
    """

    title = t("app-title-systemnotification")
    menu = [t("app-group-setup"), t("nav-systemnotification")]
    model = SystemNotification
    query_fields = ["name__icontains"]
