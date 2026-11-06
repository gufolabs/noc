# ----------------------------------------------------------------------
# vc.vlantemplate application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.vc.models.vlantemplate import VLANTemplate


class VLANTemplateApplication(ExtDocApplication):
    """
    VLANTemplate application
    """

    title = t("app-title-vlantemplate")
    menu = [t("app-group-setup"), t("nav-vlantemplate")]
    model = VLANTemplate
