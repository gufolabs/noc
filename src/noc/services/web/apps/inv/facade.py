# ----------------------------------------------------------------------
# inv.facade application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest, HttpResponse

# NOC modules
from noc.core.i18n import t
from noc.inv.models.facade import Facade
from noc.main.models.doccategory import DocCategory
from noc.services.web.base.extdocapplication import ExtDocApplication, api


class FacadeApplication(ExtDocApplication):
    """
    Facade application
    """

    title = t("app-title-facade")
    menu = [t("app-group-setup"), t("nav-facade")]
    model = Facade
    parent_model = DocCategory
    parent_field = "parent"
    query_fields = ["name__icontains", "description__icontains"]
    glyph = "table"

    @api.get("^(?P<id>[0-9a-f]{24})/facade.svg$", access="read")
    def api_svg(self, request: HttpRequest, id: str):
        o = self.get_object_or_404(Facade, id)
        return HttpResponse(o.data, content_type="image/svg+xml", status=200)
