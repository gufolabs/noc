# ---------------------------------------------------------------------
# Eltex.RG_chassis_id
# ---------------------------------------------------------------------
# Copyright (C) 2007-2017 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_chassis_id import Script as BaseScript
from noc.core.mib import mib
from noc.sa.interfaces.igetchassisid import IGetChassisID


class Script(BaseScript):
    name = "Eltex.RG.get_chassis_id"
    cache = True
    interface = IGetChassisID

    SNMP_GET_OIDS = {"SNMP": [mib["IF-MIB::ifPhysAddress", 2]]}
