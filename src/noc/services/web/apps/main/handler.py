# ----------------------------------------------------------------------
# main.handler application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.handler import Handler
from noc.services.web.base.extdocapplication import ExtDocApplication


class HandlerApplication(ExtDocApplication):
    """
    Handler application
    """

    title = t("app-title-handler")
    menu = [t("app-group-setup"), t("nav-handler")]
    model = Handler
