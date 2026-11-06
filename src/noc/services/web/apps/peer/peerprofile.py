# ---------------------------------------------------------------------
# peer.peerprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.peerprofile import PeerProfile
from noc.services.web.base.extmodelapplication import ExtModelApplication


class PeerProfileApplication(ExtModelApplication):
    """
    PeerGroup application
    """

    title = t("app-title-peerprofile")
    menu = [t("app-group-setup"), t("nav-peerprofile")]
    model = PeerProfile
    query_fields = ["name__icontains", "description__icontains"]
