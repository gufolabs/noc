# ----------------------------------------------------------------------
# cm.objectvalidationpolicy application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.cm.models.objectvalidationpolicy import ObjectValidationPolicy
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication


class ObjectValidationPolicyApplication(ExtDocApplication):
    """
    ObjectValidationPolicy application
    """

    title = t("app-title-objectvalidationpolicy")
    menu = [t("app-group-setup"), t("nav-objectvalidationpolicy")]
    model = ObjectValidationPolicy
    glyph = "ambulance"
    implied_permissions = {
        "create": ["cm:confdbquery:lookup", "cm:confdbquery:read"],
        "update": ["cm:confdbquery:lookup", "cm:confdbquery:read"],
    }

    def instance_to_dict(self, o, fields=None, nocustom=False):
        v = super().instance_to_dict(o, fields=fields, nocustom=nocustom)
        if v.get("rules") and (not fields or "rules" in fields):
            for rule, edoc in zip(o.rules, v["rules"]):
                edoc["query_params"] = self.params_to_list(rule, edoc.get("query_params"))
        return v

    @staticmethod
    def params_to_list(rule, params):
        params = params or {}
        r = []
        for p in rule.query.params:
            r.append(
                {
                    "name": p.name,
                    "type": p.type,
                    "value": params.get(p.name) or "",
                    "default": p.default,
                    "description": p.description,
                }
            )
        return r

    @staticmethod
    def list_to_params(params):
        return {p["name"]: p["value"] for p in params if p["value"] != ""}

    def clean(self, data):
        for rule in data.get("rules", []):
            rule["query_params"] = self.list_to_params(rule.get("query_params") or [])
        return super().clean(data)
