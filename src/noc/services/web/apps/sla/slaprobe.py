# ---------------------------------------------------------------------
# sla.slaprobe application
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.services.web.base.extdocapplication import ExtDocApplication
from noc.services.web.base.mixins.state import StateMixin
from noc.sla.models.slaprobe import SLAProbe


class SLAProbeApplication(StateMixin, ExtDocApplication):
    """
    SLAProbe application
    """

    title = t("app-title-slaprobe")
    menu = t("nav-slaprobe")
    query_fields = ["name__icontains", "target__icontains", "description__icontains"]
    model = SLAProbe

    def field_targets(self, o):
        return ", ".join([f"{o.type}:{o.target}"])

    def field_target_id(self, o):
        t = o.get_target()
        if t:
            return t.id
        return None
