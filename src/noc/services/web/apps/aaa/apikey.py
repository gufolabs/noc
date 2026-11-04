# ----------------------------------------------------------------------
# main.apikey application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.aaa.models.apikey import APIKey
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication


class APIKeyApplication(ExtDocApplication):
    """
    APIKey application
    """

    title = t("app-title-apikey")
    menu = [t("app-group-setup"), t("nav-apikey")]
    model = APIKey
    glyph = "key"
