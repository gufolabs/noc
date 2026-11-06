# ---------------------------------------------------------------------
# pm.metrictype application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.doccategory import DocCategory
from noc.pm.models.metrictype import MetricType
from noc.services.web.base.extdocapplication import ExtDocApplication


class MetricTypeApplication(ExtDocApplication):
    """
    MetricType application
    """

    title = t("app-title-metrictype")
    menu = [t("app-group-setup"), t("nav-metrictype")]
    model = MetricType
    parent_model = DocCategory
    parent_field = "parent"
    query_condition = "icontains"
    query_fields = ["name", "description"]
