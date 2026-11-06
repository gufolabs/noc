# ---------------------------------------------------------------------
# ASSet Manager
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.asset import ASSet
from noc.services.web.base.extmodelapplication import ExtModelApplication
from noc.services.web.base.repoinline import RepoInline


class ASSetApplication(ExtModelApplication):
    """
    ASSet application
    """

    title = t("app-title-asset")
    menu = t("nav-asset")
    model = ASSet
    query_fields = ["name__icontains", "description__icontains", "members__icontains"]
    rpsl = RepoInline("rpsl")
