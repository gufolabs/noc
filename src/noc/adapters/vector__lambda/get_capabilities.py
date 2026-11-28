# ---------------------------------------------------------------------
# Vector.Lambda.get_capabilities
# ---------------------------------------------------------------------
# Copyright (C) 2007-2018 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_capabilities import Script as BaseScript
from noc.core.mib import mib


class Script(BaseScript):
    name = "Vector.Lambda.get_capabilities"

    SNMP_GET_CHECK_OID = mib["SNMPv2-MIB::sysDescr", 0]
