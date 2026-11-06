# ---------------------------------------------------------------------
# main.pool application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.pool import Pool
from noc.services.web.base.extdocapplication import ExtDocApplication


class PoolApplication(ExtDocApplication):
    """
    Pool application
    """

    title = t("app-title-pool")
    menu = [t("app-group-setup"), t("nav-pool")]
    model = Pool
    glyph = "database"
    default_ordering = ["name"]
