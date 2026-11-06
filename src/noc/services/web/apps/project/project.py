# ---------------------------------------------------------------------
# project.project application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.project.models.project import Project
from noc.services.web.base.extmodelapplication import ExtModelApplication


class ProjectApplication(ExtModelApplication):
    """
    Project application
    """

    title = t("app-title-project")
    menu = t("nav-project")
    model = Project
    query_condition = "icontains"
    query_fields = ["code", "name", "description"]
