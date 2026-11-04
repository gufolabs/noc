# ---------------------------------------------------------------------
# ip.vrfgroup application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.ip.models.vrfgroup import VRFGroup
from noc.services.web.base.extmodelapplication import ExtModelApplication


class VRFGroupApplication(ExtModelApplication):
    """
    VRFGroup application
    """

    title = t("app-title-vrfgroup")
    menu = [t("app-group-setup"), t("nav-vrfgroup")]
    model = VRFGroup
    query_condition = "icontains"

    def field_vrf_count(self, obj):
        return obj.vrf_set.count()
