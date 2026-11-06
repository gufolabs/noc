# ---------------------------------------------------------------------
# inv.vendor application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.inv.models.vendor import Vendor
from noc.services.web.base.extdocapplication import ExtDocApplication, api


class VendorApplication(ExtDocApplication):
    """
    Vendor application
    """

    title = t("app-title-vendor")
    menu = [t("app-group-setup"), t("nav-vendor")]
    model = Vendor
    query_fields = ["name__icontains", "code__icontains", "site__icontains"]
    default_ordering = ["name"]

    @api.get("^(?P<id>[0-9a-f]{24})/json/$", access="read")
    def api_json(self, request: HttpRequest, id):
        vendor = self.get_object_or_404(Vendor, id=id)
        return vendor.to_json()
