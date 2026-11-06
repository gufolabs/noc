# ---------------------------------------------------------------------
# phone.numbercategory application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.phone.models.numbercategory import NumberCategory
from noc.services.web.base.extdocapplication import ExtDocApplication


class NumberCategoryApplication(ExtDocApplication):
    """
    NumberCategory application
    """

    title = t("app-title-numbercategory")
    menu = [t("app-group-setup"), t("nav-numbercategory")]
    model = NumberCategory
