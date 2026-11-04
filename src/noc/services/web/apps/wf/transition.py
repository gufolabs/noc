# ----------------------------------------------------------------------
# wf.transition application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.wf.models.transition import Transition


class TransitionApplication(ExtDocApplication):
    """
    Transition application
    """

    title = t("app-title-transition")
    menu = [t("app-group-setup"), t("nav-transition")]
    model = Transition
