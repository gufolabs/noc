# ---------------------------------------------------------------------
# inv.technology application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.technology import Technology
from noc.services.web.base.extdocapplication import ExtDocApplication


class TechnologyApplication(ExtDocApplication):
    """
    Technology application
    """

    title = t("app-title-technology")
    menu = [t("app-group-setup"), t("nav-technology")]
    model = Technology
    search = ["name"]

    def field_service_model__label(self, o):
        return o.service_model

    def field_client_model__label(self, o):
        return o.client_model
