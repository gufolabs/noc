# ----------------------------------------------------------------------
# wf.wfmigration application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.wf.models.wfmigration import WFMigration


class WFMigrationApplication(ExtDocApplication):
    """
    WFMigration application
    """

    title = t("app-title-wfmigration")
    menu = [t("app-group-setup"), t("nav-wfmigration")]
    model = WFMigration
