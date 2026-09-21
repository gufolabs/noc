# ---------------------------------------------------------------------
# Eltex.TAU.get_inventory
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_inventory import Script as BaseScript
from noc.sa.interfaces.igetinventory import IGetInventory


class Script(BaseScript):
    name = "Eltex.TAU.get_inventory"
    interface = IGetInventory

    def get_chassis_sensors(self):
        return [
            {
                "name": "fxsMonitoringFanState",
                "status": True,
                "description": "Fan State",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.9.10.9",
            },
            {
                "name": "fxsMonitoringFan1Rotate",
                "status": True,
                "description": "Fan1 Rotate (true/false)",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.9.10.10",
            },
            {
                "name": "fxsMonitoringFan2Rotate",
                "status": True,
                "description": "Fan2 Rotate (true/false)",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.9.10.11",
            },
        ]
