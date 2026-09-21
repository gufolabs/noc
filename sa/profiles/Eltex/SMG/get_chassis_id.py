# ---------------------------------------------------------------------
# Eltex.SMG.get_chassis_id
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_chassis_id import Script as BaseScript
from noc.sa.interfaces.igetchassisid import IGetChassisID


class Script(BaseScript):
    name = "Eltex.SMG.get_chassis_id"
    interface = IGetChassisID
    cache = True

    # SNMP_GET_OIDS = {"SNMP": ["1.3.6.1.4.1.35265.4.15.0"]}
    # SNMP_GET_OIDS = {"SNMP": ["1.3.6.1.4.1.35265.1.29.1.0"]}
    SNMP_GET_OIDS = {"SNMP": ["1.3.6.1.2.1.2.2.1.6.1"]}
