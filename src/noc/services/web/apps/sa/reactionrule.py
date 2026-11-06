# ---------------------------------------------------------------------
# sa.reactionrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.reactionrule import ReactionRule
from noc.services.web.base.extdocapplication import ExtDocApplication


class ReactionRuleApplication(ExtDocApplication):
    """
    ObjectNotification application
    """

    title = t("app-title-reactionrule")
    menu = [t("app-group-setup"), t("nav-reactionrule")]
    model = ReactionRule
