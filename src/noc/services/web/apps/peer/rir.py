# ---------------------------------------------------------------------
# peer.rir application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.rir import RIR
from noc.services.web.base.extmodelapplication import ExtModelApplication


class RIRApplication(ExtModelApplication):
    """
    RIR application
    """

    title = t("app-title-rir")
    menu = [t("app-group-setup"), t("nav-rir")]
    model = RIR
