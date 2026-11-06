# ---------------------------------------------------------------------
# fm.mibpreference application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.fm.models.mibpreference import MIBPreference
from noc.services.web.base.extdocapplication import ExtDocApplication


class MIBPreferenceApplication(ExtDocApplication):
    """
    MIBPreference application
    """

    title = t("app-title-mibpreference")
    menu = [t("app-group-setup"), t("nav-mibpreference")]
    model = MIBPreference
