# ---------------------------------------------------------------------
# OmegaTelecom.SBC.get_version
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.script.base import BaseScript
from noc.sa.interfaces.igetversion import IGetVersion


class Script(BaseScript):
    name = "OmegaTelecom.SBC.get_version"
    cache = True
    interface = IGetVersion

    def execute_snmp(self):
        version = self.snmp.get("1.2.643.2.124.1.3.4.1.2.2.0", cached=True)
        if version:
            return {"vendor": "OmegaTelecom", "platform": "SBC", "version": version}
        raise self.NotSupportedError()
