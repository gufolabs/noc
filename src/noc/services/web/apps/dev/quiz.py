# ----------------------------------------------------------------------
# dev.quiz application
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.dev.models.quiz import Quiz
from noc.services.web.base.extdocapplication import ExtDocApplication


class QuizApplication(ExtDocApplication):
    """
    Quiz application
    """

    title = t("app-title-quiz")
    menu = [t("app-group-setup"), t("nav-quiz")]
    model = Quiz

    def deserialize(self, data):
        return super().deserialize(data)
