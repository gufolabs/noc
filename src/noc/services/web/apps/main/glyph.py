# ----------------------------------------------------------------------
# main.glyph application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.glyph import Glyph
from noc.services.web.base.extdocapplication import ExtDocApplication


class GlyphApplication(ExtDocApplication):
    """
    Glyph application
    """

    title = t("app-title-glyph")
    menu = [t("app-group-setup"), t("nav-glyph")]
    model = Glyph
    glyph = "font-awesome"
    query_condition = "icontains"

    def instance_to_lookup(self, o: Glyph, fields=None):
        return {"id": str(o.id), "label": o.name, "code": o.code}
