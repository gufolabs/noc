# ---------------------------------------------------------------------
# crm.subscriber application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.crm.models.subscriber import Subscriber
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.services.web.base.mixins.state import StateMixin


class SubscriberApplication(StateMixin, ExtDocApplication):
    """
    Subscriber application
    """

    title = t("app-title-subscriber")
    menu = t("nav-subscriber")
    model = Subscriber
    query_fields = ["name__icontains"]
    implied_permissions = {"read": ["project:project:lookup"]}
