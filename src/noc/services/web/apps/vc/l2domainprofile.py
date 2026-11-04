# ----------------------------------------------------------------------
# vc.l2domainprofile application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.vc.models.l2domainprofile import L2DomainProfile


class L2DomainProfileApplication(ExtDocApplication):
    """
    L2DomainProfile application
    """

    title = t("app-title-l2domainprofile")
    menu = [t("app-group-setup"), t("nav-l2domainprofile")]
    model = L2DomainProfile
