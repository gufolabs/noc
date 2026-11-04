# ---------------------------------------------------------------------
# inv.modelinterface application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.modelinterface import ModelInterface
from noc.services.web.base.extdocapplication import ExtDocApplication


class ModelInterfaceApplication(ExtDocApplication):
    """
    ModelInterface application
    """

    title = t("app-title-modelinterface")
    menu = [t("app-group-setup"), t("nav-modelinterface")]
    model = ModelInterface
    query_fields = ["name__icontains", "description__icontains"]

    def cleaned_query(self, q):
        if "label" in q:
            q["name"] = q["label"]
            del q["label"]
        return super().cleaned_query(q)
