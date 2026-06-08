# ----------------------------------------------------------------------
# NOC.UPS.get_version
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import re

# NOC modules
from noc.core.script.base import BaseScript
from noc.sa.interfaces.igetversion import IGetVersion
from noc.core.mib import mib


class Script(BaseScript):
    name = "NOC.UPS.get_version"
    interface = IGetVersion
    cache = True

    MANUFACTURER_OID = mib["UPS-MIB::upsIdentManufacturer", 0]
    MODEL_OID = mib["UPS-MIB::upsIdentModel", 0]
    UPS_SOFTWARE_VER_OID = mib["UPS-MIB::upsIdentUPSSoftwareVersion", 0]
    AGENT_SOFTWARE_VER_OID = mib["UPS-MIB::upsIdentAgentSoftwareVersion", 0]

    def execute_snmp(self):
        vendor = self.snmp.get(self.MANUFACTURER_OID).strip() or "Generic"
        model = self.snmp.get(self.MODEL_OID).strip() or "NOCUPS"
        ups_software = self.snmp.get(self.UPS_SOFTWARE_VER_OID).strip()
        ups_agent_software = self.snmp.get(self.AGENT_SOFTWARE_VER_OID).strip()

        return {
            "vendor": vendor,
            "platform": model,
            "version": ups_agent_software,
        }
