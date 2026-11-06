# ----------------------------------------------------------------------
# inv.platform application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.platform import Platform
from noc.services.web.base.extdocapplication import ExtDocApplication


class PlatformApplication(ExtDocApplication):
    """
    Platform application
    """

    title = t("app-title-platform")
    menu = [t("app-group-setup"), t("nav-platform")]
    model = Platform
    query_fields = ["full_name__icontains", "name__icontains", "description__icontains"]
    default_ordering = ["full_name"]
