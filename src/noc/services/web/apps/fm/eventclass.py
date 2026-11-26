# ---------------------------------------------------------------------
# fm.eventclass application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.eventclass import EventClass
from noc.main.models.doccategory import DocCategory
from noc.services.web.base.extdocapplication import ExtDocApplication


class EventClassApplication(ExtDocApplication):
    """
    EventClass application
    """

    title = t("app-title-eventclass")
    menu = [t("app-group-setup"), t("nav-eventclass")]
    model = EventClass
    parent_model = DocCategory
    parent_field = "parent"
    query_fields = ["name", "description"]
    query_condition = "icontains"
