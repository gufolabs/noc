# ----------------------------------------------------------------------
# inv.resourcepool application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.resourcepool import ResourcePool
from noc.services.web.base.extdocapplication import ExtDocApplication


class ResourcePoolApplication(ExtDocApplication):
    """
    ResourcePool application
    """

    title = t("app-title-resourcepool")
    menu = [t("app-group-setup"), t("nav-resourcepool")]
    model = ResourcePool
