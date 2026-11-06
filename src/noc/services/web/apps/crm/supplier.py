# ---------------------------------------------------------------------
# crm.supplier application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.crm.models.supplier import Supplier
from noc.services.web.base.decorators.state import state_handler
from noc.services.web.base.extdocapplication import ExtDocApplication


@state_handler
class SupplierApplication(ExtDocApplication):
    """
    Supplier application
    """

    title = t("app-title-supplier")
    menu = [t("app-group-setup"), t("nav-supplier")]
    model = Supplier
    query_fields = ["name__icontains"]
    implied_permissions = {"read": ["project:project:lookup"]}
