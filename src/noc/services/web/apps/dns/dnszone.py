# ---------------------------------------------------------------------
# dns.dnszone application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.dns.models.dnszone import DNSZone
from noc.dns.models.dnszonerecord import DNSZoneRecord
from noc.services.web.base.extmodelapplication import ExtModelApplication
from noc.services.web.base.modelinline import ModelInline
from noc.services.web.base.repoinline import RepoInline


class DNSZoneApplication(ExtModelApplication):
    """
    DNSZone application
    """

    title = t("app-title-dnszone")
    menu = t("nav-dnszone")
    model = DNSZone
    query_condition = "icontains"

    records = ModelInline(DNSZoneRecord)
    zone = RepoInline("zone")
