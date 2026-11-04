# ----------------------------------------------------------------------
# inv.endpoint application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.feature import Feature
from noc.core.i18n import t
from noc.inv.models.endpoint import Endpoint
from noc.services.web.base.extdocapplication import ExtDocApplication


class EndpointApplication(ExtDocApplication):
    """
    Endpoint application
    """

    title = t("app-title-endpoint")
    menu = [t("app-group-setup"), t("nav-endpoint")]
    model = Endpoint
    glyph = "bullseye"
    field_labels = Feature.CHANNEL
    require_feature = Feature.CHANNEL
