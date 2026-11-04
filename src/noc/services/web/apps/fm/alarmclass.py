# ---------------------------------------------------------------------
# fm.alarmclass application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.alarmclass import AlarmClass
from noc.fm.models.alarmclasscategory import AlarmClassCategory
from noc.services.web.base.extdocapplication import ExtDocApplication


class AlarmClassApplication(ExtDocApplication):
    """
    AlarmClass application
    """

    title = t("app-title-alarmclass")
    menu = [t("app-group-setup"), t("nav-alarmclass")]
    model = AlarmClass
    parent_model = AlarmClassCategory
    parent_field = "parent"
    query_fields = ["name", "description"]
    query_condition = "icontains"
