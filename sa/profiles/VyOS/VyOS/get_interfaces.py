# ---------------------------------------------------------------------
# VyOS.VyOS.get_interfaces
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import re
from collections import defaultdict

# NOC modules
from noc.core.script.base import BaseScript
from noc.sa.interfaces.igetinterfaces import IGetInterfaces


class Script(BaseScript):
    name = "VyOS.VyOS.get_interfaces"
    interface = IGetInterfaces

    rx_int = re.compile(
        r"^(?P<name>.+?):\s+<(?P<flags>.+?)> mtu (?P<mtu>\d+) .+state (?P<state>\S+)"
    )
    rx_descr = re.compile(r"^\s+Description:\s+(?P<descr>.+?)\s*$")
    rx_inet = re.compile(r"^\s+inet\s+(?P<inet>\S+)")
    rx_inet6 = re.compile(r"^\s+inet6\s+(?P<inet6>\S+)")
    rx_mac = re.compile(r"\s+link/ether\s+(?P<mac>\S+)")
    rx_ifindex = re.compile(r"^(?P<ifname>\S+):\s+ifIndex = (?P<ifindex>\d+)\n", re.MULTILINE)

    def get_si(self, si):
        if si["ipv4_addresses"]:
            si["ipv4_addresses"] = list(si["ipv4_addresses"])
            si["enabled_afi"] += ["IPv4"]
        else:
            del si["ipv4_addresses"]
        if si["ipv6_addresses"]:
            si["ipv6_addresses"] = list(si["ipv6_addresses"])
            si["enabled_afi"] += ["IPv6"]
        else:
            del si["ipv6_addresses"]
        return si

    def execute_cli(self):
        ifaces = {}
        last_if = None
        il = []
        subs = defaultdict(list)
        c = self.cli("show interfaces detail", cached=True)
        for l in c.splitlines():
            match = self.rx_int.search(l)
            if match:
                last_if = match.group("name")
                il += [last_if]  # preserve order
                ifaces[last_if] = {
                    "name": last_if,
                    "ipv4_addresses": [],
                    "ipv6_addresses": [],
                    "admin_status": ",UP," in match.group("flags"),
                    "oper_status": match.group("state") in ["UP", "UNKNOWN"],
                    "enabled_afi": [],
                    "mtu": match.group("mtu"),
                }
                if "@" in last_if:
                    name, base = last_if.split("@")
                    subs[base] += [last_if]
                    ifaces[last_if]["vlan_ids"] = [int(name.split(".")[-1])]
                    ifaces[last_if]["name"] = name
                continue
            match = self.rx_descr.search(l)
            if match:
                ifaces[last_if]["description"] = match.group("descr")
                continue
            match = self.rx_mac.search(l)
            if match:
                ifaces[last_if]["mac"] = match.group("mac")
                continue
            match = self.rx_inet.search(l)
            if match:
                ifaces[last_if]["ipv4_addresses"] += [match.group("inet")]
                continue
            match = self.rx_inet6.search(l)
            if match:
                ifaces[last_if]["ipv6_addresses"] += [match.group("inet6")]
                continue
        # Process interfaces
        r = []
        for iface in il:
            if iface in subs:
                i = {
                    "name": iface.split(".")[0],
                    "type": self.profile.get_interface_type(iface),
                    "admin_status": True,
                    "oper_status": True,
                    "subinterfaces": [self.get_si(ifaces[si]) for si in subs[iface]],
                }
                if ifaces[iface].get("description"):
                    i["description"] = ifaces[iface]["description"]
            elif "@" not in iface:
                i = {
                    "name": iface.split(".")[0],
                    "type": self.profile.get_interface_type(iface),
                    "admin_status": True,
                    "oper_status": True,
                    "subinterfaces": [self.get_si(ifaces[iface])],
                }
                if ifaces[iface].get("description"):
                    i["description"] = ifaces[iface]["description"]
            else:
                continue  # Already processed
            r += [i]
        ifindex = {}
        c = self.cli("show snmp mib ifmib")
        for match in self.rx_ifindex.finditer(c):
            ifindex[match.group("ifname")] = match.group("ifindex")
        for i in r:
            macs = {si.get("mac") for si in i.get("subinterfaces", [])}
            if len(macs) == 1 and None not in macs:
                i["mac"] = macs.pop()
            if ifindex.get(i["name"]) is not None:
                i["snmp_ifindex"] = int(ifindex[i["name"]])

        return [{"interfaces": r}]
