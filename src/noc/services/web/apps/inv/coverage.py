# ---------------------------------------------------------------------
# inv.coverage application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.coverage import Coverage
from noc.inv.models.coveredbuilding import CoveredBuilding
from noc.inv.models.coveredobject import CoveredObject
from noc.services.web.base.docinline import DocInline
from noc.services.web.base.extdocapplication import ExtDocApplication


class CoverageApplication(ExtDocApplication):
    """
    Coverage application
    """

    title = t("app-title-coverage")
    menu = [t("app-group-setup"), t("nav-coverage")]
    model = Coverage
    query_fields = ["name", "description"]

    objects = DocInline(CoveredObject)
    buildings = DocInline(CoveredBuilding)
