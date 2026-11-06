# ----------------------------------------------------------------------
# inv.ifdescpatterns application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.ifdescpatterns import IfDescPatterns
from noc.services.web.base.extdocapplication import ExtDocApplication


class IfDescPatternsApplication(ExtDocApplication):
    """
    IfDescPatterns application
    """

    title = t("app-title-ifdescpatterns")
    menu = [t("app-group-setup"), t("nav-ifdescpatterns")]
    model = IfDescPatterns
