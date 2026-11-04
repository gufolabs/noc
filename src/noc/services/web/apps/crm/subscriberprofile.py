# ---------------------------------------------------------------------
# crm.subscriberprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.crm.models.subscriberprofile import SubscriberProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class SubscriberProfileApplication(ExtDocApplication):
    """
    SubscriberProfile application
    """

    title = t("app-title-subscriberprofile")
    menu = [t("app-group-setup"), t("nav-subscriberprofile")]
    model = SubscriberProfile
    query_fields = ["name__icontains", "description__icontains"]
