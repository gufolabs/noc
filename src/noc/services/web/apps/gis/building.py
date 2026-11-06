# ---------------------------------------------------------------------
# gis.building application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.comp import smart_text
from noc.core.i18n import t
from noc.gis.models.address import Address
from noc.gis.models.building import Building
from noc.gis.models.division import Division
from noc.services.web.base.docinline import DocInline
from noc.services.web.base.extdocapplication import ExtDocApplication


class AddressInline(DocInline):
    def field_text_address(self, o):
        return o.display_ru()

    def instance_to_dict(self, o, fields=None):
        r = super().instance_to_dict(o, fields=fields)
        r["remote_system"] = smart_text(r["remote_system"])
        return r


class BuildingApplication(ExtDocApplication):
    """
    Building application
    """

    title = t("app-title-building")
    menu = [t("app-group-setup"), t("nav-building")]
    glyph = "building"
    model = Building
    parent_model = Division
    parent_field = "parent"
    default_ordering = ["sort_order"]
    query_fields = ["sort_order__icontains"]

    addresses = AddressInline(Address)

    def field_full_path(self, o):
        a = o.primary_address
        if not a:
            return o.adm_division.full_path
        return a.display_ru(levels=10)
