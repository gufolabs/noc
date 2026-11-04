# ---------------------------------------------------------------------
# sla.slaprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.sla.models.slaprofile import SLAProfile


class SLAProfileApplication(ExtDocApplication):
    """
    SLAProfile application
    """

    title = t("app-title-slaprofile")
    menu = [t("app-group-setup"), t("nav-slaprofile")]
    model = SLAProfile
