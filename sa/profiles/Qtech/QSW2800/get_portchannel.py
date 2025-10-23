# ---------------------------------------------------------------------
# Qtech.QSW.get_portchannel
# ---------------------------------------------------------------------
# Copyright (C) 2007-2014 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import re

# NOC modules
from noc.sa.profiles.Generic.get_portchannel import Script as BaseScript
from noc.sa.interfaces.igetportchannel import IGetPortchannel


class Script(BaseScript):
    name = "Qtech.QSW2800.get_portchannel"
    interface = IGetPortchannel
    cache = True

    rx_portgroup = re.compile(
        r"^(?P<pc>\d+)\s+(?P<mode>\S+)\s+(?:\S+\s+)?\S+\s+\S+\s*\n", re.MULTILINE
    )
    rx_interface = re.compile(
        r"^\s+(?P<interface>\S+) is LAG member port, LAG port:(?P<pc>\S+)", re.MULTILINE
    )

    def execute_cli(self):
        r = []

        cmd = self.cli("show port-group brief", cached=True)
        for match in self.rx_portgroup.finditer(cmd):
            r += [
                {
                    "interface": "Port-Channel%s" % match.group("pc"),
                    "members": [],
                    "type": "L" if match.group("mode").lower() != "on" else "S",
                }
            ]

        cmd = self.cli("show interface | include LAG", cached=True)
        for match in self.rx_interface.finditer(cmd):
            for pc in r:
                if pc["interface"] == match.group("pc"):
                    pc["members"] += [match.group("interface")]

        return r
