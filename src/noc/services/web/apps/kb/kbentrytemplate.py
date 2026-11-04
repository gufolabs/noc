# ---------------------------------------------------------------------
# KBEntryTemplate Manager
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.kb.models.kbentrytemplate import KBEntryTemplate
from noc.services.web.base.extmodelapplication import ExtModelApplication


class KBEntryApplication(ExtModelApplication):
    """
    AdministrativeDomain application
    """

    title = t("app-title-kbentrytemplate")
    menu = [t("app-group-setup"), t("nav-kbentrytemplate")]
    model = KBEntryTemplate
