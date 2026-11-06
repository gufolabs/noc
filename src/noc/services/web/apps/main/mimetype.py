# ---------------------------------------------------------------------
# MIMEType Manager
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.mimetype import MIMEType
from noc.services.web.base.extmodelapplication import ExtModelApplication


class MIMETypeApplication(ExtModelApplication):
    title = t("app-title-mimetype")
    model = MIMEType
    menu = [t("app-group-setup"), t("nav-mimetype")]
