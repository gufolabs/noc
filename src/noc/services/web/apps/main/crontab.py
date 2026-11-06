# ----------------------------------------------------------------------
# main.crontab application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.crontab import CronTab
from noc.services.web.base.extdocapplication import ExtDocApplication


class CronTabApplication(ExtDocApplication):
    """
    CronTab application
    """

    title = t("app-title-crontab")
    menu = [t("app-group-setup"), t("nav-crontab")]
    model = CronTab
    glyph = "calendar"

    def field_crontab_expression(self, o):
        return o.crontab_expression
