# ---------------------------------------------------------------------
# peer.maintainer application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.maintainer import Maintainer
from noc.services.web.base.extmodelapplication import ExtModelApplication
from noc.services.web.base.repoinline import RepoInline


class MaintainerApplication(ExtModelApplication):
    """
    Maintainers application
    """

    title = t("app-title-maintainer")
    menu = [t("app-group-setup"), t("nav-maintainer")]
    model = Maintainer

    rpsl = RepoInline("rpsl")
