# ---------------------------------------------------------------------
# gis.layer application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.gis.models.layer import Layer
from noc.sa.interfaces.base import ColorParameter
from noc.services.web.base.extdocapplication import ExtDocApplication


class LayerApplication(ExtDocApplication):
    """
    Layer application
    """

    title = t("app-title-layer")
    menu = [t("app-group-setup"), t("nav-layer")]
    model = Layer
    clean_fields = {"stroke_color": ColorParameter(), "fill_color": ColorParameter()}
    query_fields = ["name__icontains", "description__icontains"]
