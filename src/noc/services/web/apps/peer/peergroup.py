# ---------------------------------------------------------------------
# peer.peergroup application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.peergroup import PeerGroup
from noc.services.web.base.extmodelapplication import ExtModelApplication


class PeerGroupApplication(ExtModelApplication):
    """
    PeerGroup application
    """

    title = t("app-title-peergroup")
    menu = [t("app-group-setup"), t("nav-peergroup")]
    model = PeerGroup
    query_fields = ["name__icontains", "description__icontains"]
