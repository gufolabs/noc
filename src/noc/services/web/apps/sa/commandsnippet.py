# ---------------------------------------------------------------------
# main.commandsnippet application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.commandsnippet import CommandSnippet
from noc.services.web.base.extmodelapplication import ExtModelApplication


class CommandSnippetApplication(ExtModelApplication):
    """
    commandsnippet application
    """

    title = t("app-title-commandsnippet")
    menu = [t("app-group-setup"), t("nav-commandsnippet")]
    model = CommandSnippet
    query_fields = ["name__icontains"]


# @todo: syntax checking of snippet
