# ---------------------------------------------------------------------
# ip.reportvpnstatus
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.i18n import t
from noc.inv.models.forwardinginstance import ForwardingInstance
from noc.inv.models.subinterface import SubInterface
from noc.ip.models.vrf import VRF
from noc.services.web.base.simplereport import SectionRow, SimpleReport


class ReportVPNStatusApplication(SimpleReport):
    title = t("app-title-reportvpnstatus")

    def get_data(self, **kwargs):
        data = []
        for vrf in VRF.objects.all().order_by("name"):
            if vrf.rd == "0:0":
                continue  # Skip global
            d = []
            for fi in ForwardingInstance.objects.filter(type="VRF", name=vrf.name):
                si = [
                    i.name
                    for i in SubInterface.objects.filter(forwarding_instance=fi.id).only("name")
                ]
                si = sorted(si)
                if si:
                    d.append([fi.managed_object.name, ", ".join(si)])
            if d:
                data.append(SectionRow(name=f"VRF {vrf.name}, RD: {vrf.rd} [{vrf.state.name}]"))
                data += d
        return self.from_dataset(
            title=self.title,
            columns=[t("header-managed-object-62561c"), t("header-interfaces")],
            data=data,
        )
