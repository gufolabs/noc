# ---------------------------------------------------------------------
# peer.communitytype application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.communitytype import CommunityType
from noc.services.web.base.extmodelapplication import ExtModelApplication


class CommunityTypeApplication(ExtModelApplication):
    """
    Community Types application
    """

    title = t("app-title-communitytype")
    menu = [t("app-group-setup"), t("nav-communitytype")]
    model = CommunityType
    query_fields = ["name__icontains"]
