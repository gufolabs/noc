# ---------------------------------------------------------------------
# phone.dialplan application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.phone.models.dialplan import DialPlan
from noc.services.web.base.extdocapplication import ExtDocApplication


class DialPlanApplication(ExtDocApplication):
    """
    DialPlan application
    """

    title = t("app-title-dialplan")
    menu = [t("app-group-setup"), t("nav-dialplan")]
    model = DialPlan
