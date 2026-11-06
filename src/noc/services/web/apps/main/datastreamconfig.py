# ----------------------------------------------------------------------
# main.datastreamconfig application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.datastreamconfig import DataStreamConfig
from noc.services.web.base.extdocapplication import ExtDocApplication


class DataStreamConfigApplication(ExtDocApplication):
    """
    DataStreamConfig application
    """

    title = t("app-title-datastreamconfig")
    menu = [t("app-group-setup"), t("nav-datastreamconfig")]
    model = DataStreamConfig
