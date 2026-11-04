# ---------------------------------------------------------------------
# inv.connectionrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.core.prettyjson import to_json
from noc.inv.models.connectionrule import ConnectionRule
from noc.sa.interfaces.base import DocumentParameter, ListOfParameter
from noc.services.web.base.extdocapplication import ExtDocApplication, api


class ConnectionRuleApplication(ExtDocApplication):
    """
    ConnectionRule application
    """

    title = t("app-title-connectionrule")
    menu = [t("app-group-setup"), t("nav-connectionrule")]
    model = ConnectionRule
    query_fields = ["name__icontains", "description__icontains"]

    @api.post(
        "^actions/json/$",
        access="read",
        validate={"ids": ListOfParameter(element=DocumentParameter(ConnectionRule), convert=True)},
    )
    def api_action_json(self, request: HttpRequest, ids):
        r = [o.json_data for o in ids]
        s = to_json(r, order=["name", "description"])
        return {"data": s}
