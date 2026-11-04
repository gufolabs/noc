# ---------------------------------------------------------------------
# sa.managedobjectprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.metrictype import MetricType
from noc.sa.models.managedobjectprofile import ManagedObjectProfile
from noc.services.web.base.extmodelapplication import ExtModelApplication


class ManagedObjectProfileApplication(ExtModelApplication):
    """
    ManagedObjectProfile application
    """

    title = t("app-title-managedobjectprofile")
    menu = [t("app-group-setup"), t("nav-managedobjectprofile")]
    model = ManagedObjectProfile
    query_condition = "icontains"
    query_fields = ["name", "description"]

    implied_permissions = {"launch": ["ip:addressprofile:lookup"]}

    def field_mo_count(self, o):
        return o.managedobject_set.count()

    def instance_to_dict(self, o, fields=None):
        d = super().instance_to_dict(o, fields=fields)
        if d["metrics"]:
            for m in d["metrics"]:
                mt = MetricType.get_by_id(m["metric_type"])
                if mt:
                    m["metric_type__label"] = mt.name
        return d
