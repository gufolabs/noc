# ---------------------------------------------------------------------
# ObjectNotify Manager
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.cm.models.objectnotify import ObjectNotify
from noc.core.i18n import t
from noc.services.web.base.extmodelapplication import ExtModelApplication


class ObjectNotifyApplication(ExtModelApplication):
    title = t("app-title-objectnotify")
    menu = [t("app-group-setup"), t("nav-objectnotify")]
    glyph = "flag-o"
    model = ObjectNotify
