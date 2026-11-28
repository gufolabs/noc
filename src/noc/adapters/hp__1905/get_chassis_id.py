# ---------------------------------------------------------------------
# HP.1905.get_chassis_id
# ---------------------------------------------------------------------
# Copyright (C) 2007-2013 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_chassis_id import Script as BaseScript
from noc.core.mib import mib
from noc.sa.interfaces.igetchassisid import IGetChassisID


class Script(BaseScript):
    name = "HP.1905.get_chassis_id"
    interface = IGetChassisID
    cache = True

    SNMP_GET_OIDS = {"SNMP": [mib["IF-MIB::ifPhysAddress", 3718]]}
