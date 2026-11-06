# ---------------------------------------------------------------------
# main.systemtemplate application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.systemtemplate import SystemTemplate
from noc.services.web.base.extmodelapplication import ExtModelApplication


class SystemTemplateApplication(ExtModelApplication):
    """
    SystemTemplate application
    """

    title = t("app-title-systemtemplate")
    menu = [t("app-group-setup"), t("nav-systemtemplate")]
    model = SystemTemplate
    query_fields = ["name__icontains"]
