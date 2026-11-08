# ---------------------------------------------------------------------
# Interactive prefix list builder
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.core.i18n import t
from noc.peer.models.peeringpoint import PeeringPoint
from noc.peer.models.whoiscache import WhoisCache
from noc.sa.interfaces.base import ModelParameter, UnicodeParameter
from noc.services.web.base.extapplication import ExtApplication, api

# as_set_re = "^AS(?:\d+|-\S+)(:\S+)?(?:\s+AS(?:\d+|-\S+)(:\S+)?)*$"


class PrefixListBuilderApplication(ExtApplication):
    """
    Interactive prefix list builder
    """

    title = t("app-title-prefixlistbuilder")
    menu = t("nav-prefixlistbuilder")

    @api.get(
        r"^$",
        access="read",
        validate={
            "peering_point": ModelParameter(PeeringPoint),
            "name": UnicodeParameter(required=False),
            "as_set": UnicodeParameter(),
        },
    )
    def api_list(self, request: HttpRequest, peering_point, name, as_set):
        if not WhoisCache.has_asset_members():
            return {
                "name": name,
                "prefix_list": "",
                "success": False,
                "message": t("msg-as-set-members-cache-is-empty-please-update-whois-cache"),
            }
        if not WhoisCache.has_origin_routes():
            return {
                "name": name,
                "prefix_list": "",
                "success": False,
                "message": t("msg-origin-routes-cache-is-empty-please-update-whois-cache"),
            }
        if not WhoisCache.has_asset(as_set):
            return {
                "name": name,
                "prefix_list": "",
                "success": False,
                "message": t("msg-unknown-as-set"),
            }
        prefixes = WhoisCache.resolve_as_set_prefixes_maxlen(as_set)
        if not prefixes:
            return {
                "name": name,
                "prefix_list": "",
                "success": False,
                "message": t("msg-cannot-resolve-as-set-prefixes"),
            }
        try:
            pl = peering_point.profile.get_profile().generate_prefix_list(name, prefixes)
        except NotImplementedError:
            return {
                "name": name,
                "prefix_list": "",
                "success": False,
                "message": t("msg-prefix-list-generator-is-not-implemented-for-this-profile"),
            }
        return {
            "name": name,
            "prefix_list": pl,
            "success": True,
            "message": t("msg-prefix-list-built"),
        }
