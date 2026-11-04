# ---------------------------------------------------------------------
# fm.oidalias application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.fm.models.oidalias import OIDAlias
from noc.services.web.base.extdocapplication import ExtDocApplication, api


class OIDAliasApplication(ExtDocApplication):
    """
    OIDAlias application
    """

    title = t("app-title-oidalias")
    menu = [t("app-group-setup"), t("nav-oidalias")]
    model = OIDAlias

    @api.get("^(?P<id>[0-9a-f]{24})/json/$", access="read")
    def api_json(self, request: HttpRequest, id):
        oa = self.get_object_or_404(OIDAlias, id=id)
        return oa.to_json()
