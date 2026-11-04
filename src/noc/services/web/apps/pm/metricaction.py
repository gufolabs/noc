# ---------------------------------------------------------------------
# pm.metricrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.metricaction import MetricAction
from noc.services.web.base.extdocapplication import ExtDocApplication


class MetricActionApplication(ExtDocApplication):
    """
    MetricType application
    """

    title = t("app-title-metricaction")
    menu = [t("app-group-setup"), t("nav-metricaction")]
    model = MetricAction
    query_condition = "icontains"
    query_fields = ["name", "description"]
