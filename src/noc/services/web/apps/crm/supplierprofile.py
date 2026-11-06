# ---------------------------------------------------------------------
# crm.supplierprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.crm.models.supplierprofile import SupplierProfile
from noc.services.web.base.extdocapplication import ExtDocApplication


class SupplierProfileApplication(ExtDocApplication):
    """
    SupplierProfile application
    """

    title = t("app-title-supplierprofile")
    menu = [t("app-group-setup"), t("nav-supplierprofile")]
    model = SupplierProfile
    query_fields = ["name__icontains", "description__icontains"]
