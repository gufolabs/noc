# ----------------------------------------------------------------------
# inv.sensor application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.sensor import Sensor
from noc.services.web.base.decorators.state import state_handler
from noc.services.web.base.extdocapplication import ExtDocApplication


@state_handler
class SensorApplication(ExtDocApplication):
    """
    ResourceGroup application
    """

    title = t("app-title-sensor")
    menu = [t("app-group-setup"), t("nav-sensor")]
    model = Sensor
    query_fields = ["label"]
    query_condition = "icontains"

    # def cleaned_query(self, q):
    #     q = super().cleaned_query(q)
    #     if "managed_object" in q:
    #         q["object__in"] = Object.get_managed(q["managed_object"])
    #         del q["managed_object"]
    #     return q
