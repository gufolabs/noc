# ----------------------------------------------------------------------
# main.extstorage application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.extstorage import ExtStorage
from noc.services.web.base.extdocapplication import ExtDocApplication


class ExtStorageApplication(ExtDocApplication):
    """
    ExtStorage application
    """

    title = t("app-title-extstorage")
    menu = [t("app-group-setup"), t("nav-extstorage")]
    model = ExtStorage
    glyph = "database"
