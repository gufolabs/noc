# ---------------------------------------------------------------------
# dns.dnszoneprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.dns.models.dnszoneprofile import DNSZoneProfile
from noc.services.web.base.extmodelapplication import ExtModelApplication


class DNSZoneProfileApplication(ExtModelApplication):
    """
    DNSZoneProfiles application
    """

    title = t("app-title-dnszoneprofile")
    menu = [t("app-group-setup"), t("nav-dnszoneprofile")]
    model = DNSZoneProfile

    def field_masterslabel(self, o):
        return ", ".join([s.name for s in o.masters.all()])

    def field_slaveslabel(self, o):
        return ", ".join([s.name for s in o.slaves.all()])
