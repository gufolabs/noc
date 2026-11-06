# ---------------------------------------------------------------------
# sa.profilecheckrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.profilecheckrule import ProfileCheckRule
from noc.services.web.base.extdocapplication import ExtDocApplication


class ProfileCheckRuleApplication(ExtDocApplication):
    """
    ProfileCheckRule application
    """

    title = t("app-title-profilecheckrule")
    menu = [t("app-group-setup"), t("nav-profilecheckrule")]
    model = ProfileCheckRule
    query_fields = ["name__icontains", "description__icontains", "value__icontains"]
