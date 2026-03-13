# ---------------------------------------------------------------------
# Eltex.ESR.get_interfaces
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import re

# NOC modules
from noc.sa.profiles.Generic.get_interfaces import Script as BaseScript
from noc.sa.interfaces.igetinterfaces import IGetInterfaces
from noc.core.text import parse_table
from noc.core.mib import mib
from noc.core.validators import is_ipv4, is_ipv6


class Script(BaseScript):
    name = "Eltex.ESR.get_interfaces"
    interface = IGetInterfaces

    rx_iface = re.compile(r"Interface:?\s+(?P<iface>\S+)")

    types = {"gi": "physical", "te": "physical", "twe": "physical", "oob": "physical", "lo": "loopback", "po": "aggregated", "br": "SVI"}
    def get_ifindexes(self):
        r = {}
        unknown_interfaces = []
        if self.has_snmp():
            try:
                for oid, name in self.snmp.getnext(mib["IF-MIB::ifDescr"]):
                    try:
                        v = self.profile.convert_interface_name(name)
                    except InterfaceTypeError as why:
                        self.logger.debug(f"Ignoring unknown interface {name}: {why}")
                        unknown_interfaces += [name]
                        continue
                    ifindex = int(oid.split(".")[-1])
                    r[v] = ifindex
                if unknown_interfaces:
                    self.logger.info(
                        "%d unknown interfaces has been ignored", len(unknown_interfaces)
                    )
            except self.snmp.TimeOutError:
                pass
        return r

    def get_mpls_vpn(self):
        imap = {}  # interface -> VRF
        vrfs = {
            "default": {
                "forwarding_instance": "default",
                "type": "ip",
                "interfaces": [],
            }
        }
        try:
            r = self.scripts.get_mpls_vpn()
        except self.CLISyntaxError:
            r = []
        for v in r:
            if v["type"] == "VRF":
                vrfs[v["name"]] = {
                    "forwarding_instance": v["name"],
                    "type": "VRF",
                    "interfaces": [],
                }
                rd = v.get("rd")
                if rd:
                    vrfs[v["name"]]["rd"] = rd
                vpn_id = v.get("vpn_id")
                if vpn_id:
                    vrfs[v["name"]]["vpn_id"] = vpn_id
                for i in v["interfaces"]:
                    imap[i] = v["name"]

        return vrfs, imap

    def execute_cli(self, interface=None):
        stp = []
        index = self.scripts.get_ifindexes()
        vrrp = []
        descriptions = {}
        descrs = ''
        c = self.cli("show interfaces description", cached=True)
        for line in c.splitlines():
            if not line.startswith("  ") and line != "":
                descrs += "\n"
                descrs += line
        for ifname, astate, lstate, descr in parse_table(descrs):
            if descr != "--":
                descriptions[ifname] = descr
        ipv6_addresses = {}
        c = self.cli("show ipv6 interfaces", cached=True)
        for line in parse_table(c):
            if is_ipv6(line[0]):
                ipv6_addresses[line[1]] = line[0]
        interfaces = {}
        c = self.cli("show interfaces status", cached=True)
        # ESR-12V ver.1.0.9 produce random empty lines
        c = "\n".join([s for s in c.split("\n") if s])
        for line in parse_table(c, allow_wrap=True):
            # In some cases may be over 5 columns
            ifname = line[0]
            astate = line[1]
            lstate = line[2]
            mtu = line[3]
            mac = line[4]
            description = descriptions.get(ifname)
            sub = {
                "name": ifname,
                "admin_status": astate == "Up",
                "oper_status": lstate == "Up",
                "mtu": mtu,
                "mac": mac,
                "enabled_afi": [],
                "enabled_protocols": [],
                "snmp_ifindex": index[ifname.replace("twe", "Tw ").replace("oob", "Oo ").replace("lo", "Lo ").replace("br", "Br ")],
            }
            ip_addresses = {}
            c = self.cli(f"show ip interfaces {ifname}", cached=True)
            for line in parse_table(c):
                # When type is DHCP, IP address may be '--'
                if is_ipv4(line[0].split('/')[0]):
                    ip_addresses[line[1]] = line[0]
            if ip_addresses.get(ifname):
                sub["enabled_afi"] += ["IPv4"]
                sub["ipv4_addresses"] = [ip_addresses.get(ifname)]
            if ipv6_addresses.get(ifname):
                sub["enabled_afi"] += ["IPv6"]
                sub["ipv6_addresses"] = [ipv6_addresses.get(ifname)]
            if description:
                sub["description"] = description
            if ifname in vrrp:
                sub["enabled_protocols"] += ["VRRP"]
            if "." in ifname:
                name, vlan_ids = ifname.split(".")
                sub["vlan_ids"] = [vlan_ids]
                interfaces[name]["subinterfaces"] += [sub]
                continue
            typ = self.types[ifname[:3].strip("0123456789")]
            iface = {
                "name": ifname,
                "type": typ,
                "admin_status": astate == "Up",
                "oper_status": lstate == "Up",
                "mac": mac,
                "snmp_ifindex": index[ifname.replace("twe", "Tw ").replace("oob", "Oo ").replace("lo", "Lo ").replace("br", "Br ")],
                "enabled_protocols": ["NDP"],
                "subinterfaces": [sub],
            }
            if description:
                iface["description"] = description
            if ifname in stp:
                iface["enabled_protocols"] += ["STP"]
            interfaces[ifname] = iface
        vrfs, vrf_if_map = self.get_mpls_vpn_mappings()
        for i in interfaces.keys():
            iface_vrf = "default"
            subs = interfaces[i]["subinterfaces"]
            interfaces[i]["subinterfaces"] = []
            if i.replace("twe","Tw ") in vrf_if_map:
                iface_vrf = vrf_if_map[i.replace("twe","Tw ")]
                vrfs[vrf_if_map[i.replace("twe","Tw ")]]["interfaces"] += [interfaces[i]]
            else:
                vrfs["default"]["interfaces"] += [interfaces[i]]
            for s in subs:
                if s["name"].replace("twe","Tw ") in vrf_if_map and vrf_if_map[s["name"].replace("twe","Tw ")] != iface_vrf:
                    vrfs[vrf_if_map[s["name"].replace("twe","Tw ")]]["interfaces"] += [
                        {
                            "name": s["name"],
                            "type": "other",
                            "enabled_protocols": [],
                            "subinterfaces": [s],
                        }
                    ]
                else:
                    interfaces[i]["subinterfaces"] += [s]
        return list(vrfs.values())

    def clean_iftype(self, ifname, ifindex):
        iftype = self.snmp.get(mib["IF-MIB::ifType", ifindex], cached=True)
        return self.profile.get_interface_type(iftype)
