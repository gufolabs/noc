# ---------------------------------------------------------------------
# dns.dnsserver application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.dns.models.dnsserver import DNSServer
from noc.services.web.base.extmodelapplication import ExtModelApplication


class DNSServerApplication(ExtModelApplication):
    """
    DNSServer application
    """

    title = t("app-title-dnsserver")
    menu = [t("app-group-setup"), t("nav-dnsserver")]
    model = DNSServer
