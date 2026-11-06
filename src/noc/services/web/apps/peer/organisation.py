# ---------------------------------------------------------------------
# peer.organisation application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.organisation import Organisation
from noc.services.web.base.extmodelapplication import ExtModelApplication


class OrganisationApplication(ExtModelApplication):
    """
    Person application
    """

    title = t("app-title-organisation")
    menu = [t("app-group-setup"), t("nav-organisation")]
    model = Organisation
    query_fields = ["organisation__icontains", "org_name__icontains"]
