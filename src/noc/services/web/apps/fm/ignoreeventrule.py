# ---------------------------------------------------------------------
# fm.ignoreeventrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.ignoreeventrules import IgnoreEventRules
from noc.sa.interfaces.base import REParameter
from noc.services.web.base.extmodelapplication import ExtModelApplication


class IgnoreEventRuleApplication(ExtModelApplication):
    """
    IgnoreEventRule application
    """

    title = t("app-title-ignoreeventrule")
    menu = [t("app-group-setup"), t("nav-ignoreeventrule")]
    model = IgnoreEventRules

    clean_fields = {"left_re": REParameter(), "right_re": REParameter()}
