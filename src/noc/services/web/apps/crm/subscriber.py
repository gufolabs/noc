# ---------------------------------------------------------------------
# crm.subscriber application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.crm.models.subscriber import Subscriber
from noc.services.web.base.decorators.state import state_handler
from noc.services.web.base.extdocapplication import ExtDocApplication


@state_handler
class SubscriberApplication(ExtDocApplication):
    """
    Subscriber application
    """

    title = t("app-title-subscriber")
    menu = t("nav-subscriber")
    model = Subscriber
    query_fields = ["name__icontains"]
    implied_permissions = {"read": ["project:project:lookup"]}
