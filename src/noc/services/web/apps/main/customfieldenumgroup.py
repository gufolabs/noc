# ---------------------------------------------------------------------
# main.customfieldenumgroup application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.main.models.customfieldenumgroup import CustomFieldEnumGroup
from noc.main.models.customfieldenumvalue import CustomFieldEnumValue
from noc.services.web.base.extmodelapplication import ExtModelApplication
from noc.services.web.base.modelinline import ModelInline


class CustomFieldEnumGroupApplication(ExtModelApplication):
    """
    CustomFieldEnumGroup application
    """

    title = t("app-title-customfieldenumgroup")
    menu = [t("app-group-setup"), t("nav-customfieldenumgroup")]
    model = CustomFieldEnumGroup

    values = ModelInline(CustomFieldEnumValue)
