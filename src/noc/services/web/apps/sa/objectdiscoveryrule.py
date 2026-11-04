# ---------------------------------------------------------------------
# sa.objectdiscoveryrule application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.sa.models.objectdiscoveryrule import CheckItem, ObjectDiscoveryRule
from noc.services.web.base.extdocapplication import ExtDocApplication


class ObjectDiscoveryRuleApplication(ExtDocApplication):
    """
    Discovered Object
    """

    title = t("app-title-objectdiscoveryrule")
    menu = [t("app-group-setup"), t("nav-objectdiscoveryrule")]
    model = ObjectDiscoveryRule
    query_fields = ["name__icontains", "description__icontains"]
    default_ordering = ["name"]

    def instance_to_dict(self, o, fields=None, nocustom=False):
        r = super().instance_to_dict(o, fields=fields, nocustom=nocustom)
        if isinstance(o, CheckItem):
            r["check__label"] = r["check"]
        return r
