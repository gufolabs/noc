# ---------------------------------------------------------------------
# Eltex.SMG.get_version
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.script.base import BaseScript
from noc.sa.interfaces.igetversion import IGetVersion


class Script(BaseScript):
    name = "Eltex.SMG.get_version"
    cache = True
    interface = IGetVersion

    def execute_snmp(self):
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.3.0", cached=True)
        if v:
            # Example of received version info:
            # ECSS-10 V.3.407.1.6865 3016/S/DEMO [2026-03-16 - 2026-05-31] Build: Jul 14 2025 17:45:03
            match = self.re_search(r"V\.(?P<version>\S+)\s(?P<platform>\d+)", v)
            version = match.group("version")
            platform = "SMG-" + match.group("platform")
            return {"vendor": "Eltex", "platform": platform, "version": version}
        raise self.NotSupportedError()

    def execute_cli(self):
        self.cli("sh")
        version = self.cli("cat /usr/local/version")
        # platform = self.cli("cat /usr/share/mibs/eltex/eltex-smg.mib")
        return {"vendor": "Eltex", "platform": "SMG", "version": version}
