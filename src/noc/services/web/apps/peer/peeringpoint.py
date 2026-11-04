# ---------------------------------------------------------------------
# peer.peeringpoint application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.peeringpoint import PeeringPoint
from noc.services.web.base.extmodelapplication import ExtModelApplication


class PeeringPointApplication(ExtModelApplication):
    """
    Peering Point application
    """

    title = t("app-title-peeringpoint")
    menu = [t("app-group-setup"), t("nav-peeringpoint")]
    model = PeeringPoint
    query_fields = ["hostname__icontains", "router_id__icontains"]
