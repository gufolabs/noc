# ---------------------------------------------------------------------
# inv.CPEprofile application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------


# NOC modules
from noc.core.i18n import t
from noc.inv.models.cpeprofile import CPEProfile
from noc.main.models.label import MATCH_BADGES, MATCH_OPS
from noc.services.web.base.extdocapplication import ExtDocApplication


def clean_label(label: str) -> tuple[str, str, list[str]]:
    r = label.split("::")
    badges = []
    if len(r) == 1:
        return "", label, badges
    if r[0] == "noc":
        r.pop(0)
    if r[-1] in MATCH_OPS:
        badges.append(MATCH_BADGES[r[-1]])
        r.pop(-1)
    return "::".join(r[:-1]), r[-1], badges


class CPEProfileApplication(ExtDocApplication):
    """
    InterfaceProfile application
    """

    title = t("app-title-cpeprofile")
    menu = [t("app-group-setup"), t("nav-cpeprofile")]
    model = CPEProfile
    query_condition = "icontains"
    query_fields = ["name", "description"]
