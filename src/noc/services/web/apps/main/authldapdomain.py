# ---------------------------------------------------------------------
# main.authldapdomain application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.authldapdomain import AuthLDAPDomain
from noc.services.web.base.extdocapplication import ExtDocApplication


class AuthLDAPDomainApplication(ExtDocApplication):
    """
    AuthLDAPDomain application
    """

    title = t("app-title-authldapdomain")
    menu = [t("app-group-setup"), t("nav-authldapdomain")]
    model = AuthLDAPDomain
