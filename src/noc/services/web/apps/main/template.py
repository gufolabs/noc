# ---------------------------------------------------------------------
# main.template application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.template import Template
from noc.services.web.base.extmodelapplication import ExtModelApplication


class TemplateApplication(ExtModelApplication):
    """
    Template application
    """

    title = t("app-title-template")
    menu = [t("app-group-setup"), t("nav-template")]
    model = Template
    query_fields = ["name__icontains", "subject__icontains"]
