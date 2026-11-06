# ---------------------------------------------------------------------
# sa.serviceprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.serviceprofile import ServiceProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class ServiceProfileApplication(ExtDocApplication):
    """
    ServiceProfile application
    """

    title = t("app-title-serviceprofile")
    menu = [t("app-group-setup"), t("nav-serviceprofile")]
    model = ServiceProfile
