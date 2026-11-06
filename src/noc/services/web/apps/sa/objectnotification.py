# ---------------------------------------------------------------------
# sa.objectnotification application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.objectnotification import ObjectNotification
from noc.services.web.base.extmodelapplication import ExtModelApplication


class ObjectNotificationApplication(ExtModelApplication):
    """
    ObjectNotification application
    """

    title = t("app-title-objectnotification")
    menu = [t("app-group-setup"), t("nav-objectnotification")]
    model = ObjectNotification
