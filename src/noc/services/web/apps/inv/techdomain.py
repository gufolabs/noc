# ----------------------------------------------------------------------
# inv.techdomain application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.techdomain import TechDomain
from noc.services.web.base.extdocapplication import ExtDocApplication


class TechDomainApplication(ExtDocApplication):
    """
    TechDomain application
    """

    title = t("app-title-techdomain")
    menu = [t("app-group-setup"), t("nav-techdomain")]
    model = TechDomain
    glyph = "flask"
