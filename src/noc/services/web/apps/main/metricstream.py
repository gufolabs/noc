# ----------------------------------------------------------------------
# main.metricstream application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.metricstream import MetricStream
from noc.services.web.base.extdocapplication import ExtDocApplication


class MetricStreamApplication(ExtDocApplication):
    """
    CHPolicy application
    """

    title = t("app-title-metricstream")
    menu = [t("app-group-setup"), t("nav-metricstream")]
    model = MetricStream
