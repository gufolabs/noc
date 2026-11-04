# ---------------------------------------------------------------------
# inv.modelmapping application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.modelmapping import ModelMapping
from noc.services.web.base.extdocapplication import ExtDocApplication


class ModelMappingApplication(ExtDocApplication):
    """
    ModelMapping application
    """

    title = t("app-title-modelmapping")
    menu = [t("app-group-setup"), t("nav-modelmapping")]
    model = ModelMapping
