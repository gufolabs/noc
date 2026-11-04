# ---------------------------------------------------------------------
# Language Manager
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.language import Language
from noc.services.web.base.extmodelapplication import ExtModelApplication


class LanguageApplication(ExtModelApplication):
    title = t("app-title-language")
    model = Language
    menu = [t("app-group-setup"), t("nav-language")]
    query_fields = ["name__icontains", "native_name__icontains"]
