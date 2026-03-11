# ---------------------------------------------------------------------
# Eltex.ESR;.get_mpls_vpn
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import re

# NOC modules
from noc.sa.profiles.Generic.get_mpls_vpn import Script as BaseScript
from noc.sa.interfaces.igetmplsvpn import IGetMPLSVPN
from noc.core.text import parse_kv


class Script(BaseScript):
    name = "Eltex.ESR.get_mpls_vpn"
    interface = IGetMPLSVPN


    rx_line = re.compile(r"^ip vrf\s+(?P<vrf>\S+?)$", re.IGNORECASE)
    rx_rd = re.compile(r"^  rd (?P<rd>\S+:\S+|<not set>)$", re.IGNORECASE)
    rx_import = re.compile(
        r"^  route-target import \s+(?P<rt_import>(\S+:\S+\s*){1,}|<not set>)$", re.IGNORECASE
    )
    rx_export = re.compile(
        r"^  route-target export \s+(?P<rt_export>(\S+:\S+\s*){1,}|<not set>)$", re.IGNORECASE
    )
    rx_rt_format = re.compile(r"(\d+\:\d+,?)+")

    def execute_cli(self, **kwargs):
        vpns = []
        try:
            v = self.cli("show running-config vrf", cached=True)
        except self.CLISyntaxError:
            return []
        block = None
        block_splitter = None
        line_format = None
        for line in v.splitlines():
            match = self.rx_line.search(line)
            if match:
                vpns += [
                    {
                        "type": "VRF",
                        "status": True,
                        "vpn_id": "",
                        "name": match.group("vrf").strip(),
                        "interfaces": [],
                    }
                ]
                vrf_name=vpns[-1]["name"]
                rx_vpn_int = re.compile(r"^(?:\s{,4}(%s) \s+|\s{6,})(?P<iface>.+?),?\s*$"%vrf_name, re.IGNORECASE)
                for line in self.cli(f"show ip vrf {vrf_name}").splitlines():
                    match_int = rx_vpn_int.match(line)
                    if match_int:
                        for ints in match_int.group("iface").replace(",","").split():
                            if "-" not in ints:
                                vpns[-1]["interfaces"] += [ints]
                            elif "--" not in ints:
                                result = []
                                intn, rng = ints.split('.')
                                a, b = rng.split('-')
                                a, b = int(a), int(b)
                                result.extend(range(a, b + 1))
                                for i in result:
                                    intf = intn+'.'+str(i)
                                    vpns[-1]["interfaces"] += [intf]
            elif vpns:
                match_rd = self.rx_rd.match(line)
                if match_rd:
                    rd = match_rd.group("rd")
                    if ":" in rd:
                        vpns[-1]["rd"] = rd
                    continue
                match_export = self.rx_export.match(line)
                if match_export:
                    vpns[-1]["rt_export"] = match_export.group("rt_export").split()
                    block = "rt_export"
                    line_format = self.rx_rt_format
                match_import = self.rx_import.match(line)
                if match_import:
                    vpns[-1]["rt_import"] = match_import.group("rt_import").split()
                    block = "rt_import"
                    line_format = self.rx_rt_format
        return vpns

