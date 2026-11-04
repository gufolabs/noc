# ---------------------------------------------------------------------
# peer.person application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.peer.models.person import Person
from noc.services.web.base.extmodelapplication import ExtModelApplication
from noc.services.web.base.repoinline import RepoInline


class PersonApplication(ExtModelApplication):
    """
    Person application
    """

    title = t("app-title-person")
    menu = [t("app-group-setup"), t("nav-person")]
    model = Person
    query_fields = ["nic_hdl__icontains", "person__icontains"]

    rpsl = RepoInline("rpsl")
