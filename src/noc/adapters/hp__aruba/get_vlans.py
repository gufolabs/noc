# ---------------------------------------------------------------------
# HP.Aruba.get_vlans
# ---------------------------------------------------------------------
# Copyright (C) 2007-2023 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import re

# NOC modules
from noc.adapters.generic__host.get_vlans import Script as BaseScript
from noc.sa.interfaces.igetvlans import IGetVlans


class Script(BaseScript):
    name = "HP.Aruba.get_vlans"
    interface = IGetVlans

    rx_vlan = re.compile(r"^(?P<vlan>\d+)\s+(?P<name>\S+)\s+", re.MULTILINE)

    def execute_cli(self, **kwargs):
        r = []
        v = self.cli("show vlan", cached=True)
        for vlan, name in self.rx_vlan.findall(v):
            r.append(
                {
                    "vlan_id": vlan,
                    "name": name,
                }
            )
        return r
