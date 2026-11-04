# ----------------------------------------------------------------------
# dev.spec application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.dev.models.spec import Spec
from noc.services.web.base.extdocapplication import ExtDocApplication


class SpecApplication(ExtDocApplication):
    """
    Spec application
    """

    title = t("app-title-spec")
    menu = [t("app-group-setup"), t("nav-spec")]
    model = Spec
