# ---------------------------------------------------------------------
# Eltex.SMG.get_inventory
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.interfaces.igetinventory import IGetInventory
from noc.sa.profiles.Generic.get_inventory import Script as BaseScript

POWER_METRICS = [
    ("pmExist", "1.3.6.1.4.1.35265.1.29.36.1.2"),
    ("pmPower", "1.3.6.1.4.1.35265.1.29.36.1.3"),
]


class Script(BaseScript):
    name = "Eltex.SMG.get_inventory"
    interface = IGetInventory
    cache = True

    def get_chassis_sensors(self):
        r = [
            {
                "name": "smgFan0",
                "status": True,
                "description": "Current fan #0 speed",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.29.35.3.0",
            },
            {
                "name": "smgFan1",
                "status": True,
                "description": "Current fan #1 speed",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.29.35.4.0",
            },
            {
                "name": "smgFan2",
                "status": True,
                "description": "Current fan #2 speed",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.29.35.5.0",
            },
            {
                "name": "smgFan3",
                "status": True,
                "description": "Current fan #3 speed",
                "measurement": "1",
                "snmp_oid": "1.3.6.1.4.1.35265.1.29.35.6.0",
            },
        ]

        t = self.snmp.get_tables([m[1] for m in POWER_METRICS], bulk=True)
        print("  t", t, type(t))
        for module_metrics in t:
            print("  module_metrics", module_metrics, type(module_metrics))
            module_number = module_metrics[0]
            for metric_name, metric_oid in POWER_METRICS:
                d = {
                    "name": f"{module_number}.{metric_name}",
                    "status": True,
                    "description": "",
                    "measurement": "1",
                    "snmp_oid": f"{metric_oid}.{module_number}",
                }
                r.append(d)
        return r
