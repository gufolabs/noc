# ---------------------------------------------------------------------
# peer.community application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.community import Community
from noc.services.web.base.extmodelapplication import ExtModelApplication


class CommunityApplication(ExtModelApplication):
    """
    Community application
    """

    title = t("app-title-community")
    menu = t("nav-community")
    model = Community
    query_fields = ["community__icontains", "description__icontains"]
