# ----------------------------------------------------------------------
# cm.confdbquery application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.cm.models.confdbquery import ConfDBQuery
from noc.core.confdb.engine.base import Engine
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication


class ConfDBQueryApplication(ExtDocApplication):
    """
    ConfDBQuery application
    """

    title = t("app-title-confdbquery")
    menu = [t("app-group-setup"), t("nav-confdbquery")]
    model = ConfDBQuery
    glyph = "file-code-o"

    def clean(self, data):
        data = super().clean(data)
        src = data.get("source", "")
        try:
            Engine().compile(src)
        except SyntaxError as e:
            raise ValueError("Syntax error: %s", e)
        return data
