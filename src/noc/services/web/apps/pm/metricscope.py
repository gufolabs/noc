# ----------------------------------------------------------------------
# pm.metricscope application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.pm.models.metricscope import MetricScope
from noc.services.web.base.extdocapplication import ExtDocApplication


class MetricScopeApplication(ExtDocApplication):
    """
    MetricScope application
    """

    title = t("app-title-metricscope")
    menu = [t("app-group-setup"), t("nav-metricscope")]
    model = MetricScope
