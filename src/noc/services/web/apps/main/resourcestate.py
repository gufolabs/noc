# ---------------------------------------------------------------------
# main.resourcestate application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.resourcestate import ResourceState
from noc.services.web.base.extmodelapplication import ExtModelApplication


class ResourceStateApplication(ExtModelApplication):
    """
    ResourceState application
    """

    title = t("app-title-resourcestate")
    menu = [t("app-group-setup"), t("nav-resourcestate")]
    model = ResourceState
    query_fields = ["name", "description"]
    query_condition = "icontains"
