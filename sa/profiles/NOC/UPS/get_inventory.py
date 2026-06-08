# ---------------------------------------------------------------------
# NOC.UPS.get_inventory
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_inventory import Script as BaseScript
from noc.sa.interfaces.igetinventory import IGetInventory
from noc.core.mib import mib
from noc.core.snmp.error import SNMPError


class Script(BaseScript):
    name = "NOC.UPS.get_inventory"
    interface = IGetInventory

    def get_chassis_sensors_default(self):
        is_need_zeroend = False

        def format_index(x):
            if is_need_zeroend:
                return [x, 0]
            return [x]

        #        def format_table(oid, name, description, measurement)
        #            r = []
        #            for x, v in self.snmp.get_table(oid=oid):
        #                r.append({
        #                    "name": f"{name}.{x}",
        #                    "status": True,
        #                    "description": f"{description}.{x}",
        #                    "measurement": measurement,
        #                    "snmp_oid": ".".join([oid, x]),
        #                })
        #
        #            return r

        r = [
            {
                "name": "upsBatteryStatus",
                "status": True,
                "description": "Battery status",
                "measurement": "StatusEnum",
                "snmp_oid": mib["UPS-MIB::upsBatteryStatus", 0],
            },
            {
                "name": "upsBatteryVoltage",
                "status": True,
                "description": "Battery voltage",
                "measurement": "Volt DC",
                "snmp_oid": mib["UPS-MIB::upsBatteryVoltage", 0],
            },
            {
                "name": "upsBatteryCurrent",
                "status": True,
                "description": "Battery current",
                "measurement": "Ampere",
                "snmp_oid": mib["UPS-MIB::upsBatteryCurrent", 0],
            },
            {
                "name": "upsBatteryTemperature",
                "status": True,
                "description": "Battery temperature",
                "measurement": "Celsius",
                "snmp_oid": mib["UPS-MIB::upsBatteryTemperature", 0],
            },
            {
                "name": "upsOutputSource",
                "status": True,
                "description": "Output Source",
                "measurement": "StatusEnum",
                "snmp_oid": mib["UPS-MIB::upsOutputSource", 0],
            },
            {
                "name": "upsSecondsOnBattery",
                "status": True,
                "description": "Seconds on Battery",
                "measurement": "Second",
                "snmp_oid": mib["UPS-MIB::upsSecondsOnBattery", 0],
            },
            {
                "name": "upsEstimatedMinutesRemaining",
                "status": True,
                "description": "Estimated time",
                "measurement": "Second",
                "snmp_oid": mib["UPS-MIB::upsEstimatedMinutesRemaining", 0],
            },
            {
                "name": "upsEstimatedChargeRemaining",
                "status": True,
                "description": "Charge Level",
                "measurement": "Percent",
                "snmp_oid": mib["UPS-MIB::upsEstimatedChargeRemaining", 0],
            },
        ]

        num_inputs = self.snmp.get(mib["UPS-MIB::upsInputNumLines", 0])

        d = self.snmp.get(mib["UPS-MIB::upsInputFrequency", 1])
        if d is None:
            d = self.snmp.get(mib["UPS-MIB::upsInputFrequency", 1, 0])
            if not (d is None):
                is_need_zeroend = True

        for x in range(1, num_inputs + 1):
            r.extend(
                [
                    {
                        "name": f"upsInputFrequency.{x}",
                        "status": True,
                        "description": f"Input Frequency {x}",
                        "measurement": "Hertz",
                        "snmp_oid": mib["UPS-MIB::upsInputFrequency", *format_index(x)],
                    },
                    {
                        "name": f"upsInputCurrent.{x}",
                        "status": True,
                        "description": f"Input Current {x}",
                        "measurement": "Ampere",
                        "snmp_oid": mib["UPS-MIB::upsInputCurrent", *format_index(x)],
                    },
                    {
                        "name": f"upsInputVoltage.{x}",
                        "status": True,
                        "description": f"Input Voltage {x}",
                        "measurement": "Volt AC",
                        "snmp_oid": mib["UPS-MIB::upsInputVoltage", *format_index(x)],
                    },
                    {
                        "name": f"upsInputTruePower.{x}",
                        "status": True,
                        "description": f"Input Power {x}",
                        "measurement": "Watt",
                        "snmp_oid": mib["UPS-MIB::upsInputTruePower", *format_index(x)],
                    },
                ]
            )

        num_outputs = self.snmp.get(mib["UPS-MIB::upsOutputNumLines", 0])

        for x in range(1, num_inputs + 1):
            r.extend(
                [
                    {
                        "name": f"upsOutputCurrent.{x}",
                        "status": True,
                        "description": f"Output Current {x}",
                        "measurement": "Ampere",
                        "snmp_oid": mib["UPS-MIB::upsOutputCurrent", *format_index(x)],
                    },
                    {
                        "name": f"upsOutputVoltage.{x}",
                        "status": True,
                        "description": f"Output Voltage {x}",
                        "measurement": "Volt AC",
                        "snmp_oid": mib["UPS-MIB::upsOutputVoltage", *format_index(x)],
                    },
                    {
                        "name": f"upsOutputPower.{x}",
                        "status": True,
                        "description": f"Output Power {x}",
                        "measurement": "Watt",
                        "snmp_oid": mib["UPS-MIB::upsOutputPower", *format_index(x)],
                    },
                    {
                        "name": f"upsOutputPercentLoad.{x}",
                        "status": True,
                        "description": f"Output Load % {x}",
                        "measurement": "Percent",
                        "snmp_oid": mib["UPS-MIB::upsOutputPercentLoad", *format_index(x)],
                    },
                    {
                        "name": f"upsOutputFrequency.{x}",
                        "status": True,
                        "description": f"Output Frequency {x}",
                        "measurement": "Hertz",
                        "snmp_oid": mib["UPS-MIB::upsOutputFrequency", *format_index(x)],
                    },
                ]
            )

        bypass_lines = self.snmp.get(mib["UPS-MIB::upsBypassNumLines", 0])

        for x in range(1, bypass_lines + 1):
            r.extend(
                [
                    {
                        "name": f"upsBypassVoltage.{x}",
                        "status": True,
                        "description": f"Bypass Voltage {x}",
                        "measurement": "Volt AC",
                        "snmp_oid": mib["UPS-MIB::upsBypassVoltage", *format_index(x)],
                    },
                    {
                        "name": f"upsBypassCurrent.{x}",
                        "status": True,
                        "description": f"Bypass Current {x}",
                        "measurement": "Ampere",
                        "snmp_oid": mib["UPS-MIB::upsBypassCurrent", *format_index(x)],
                    },
                    {
                        "name": f"upsBypassPower.{x}",
                        "status": True,
                        "description": f"Bypass Power {x}",
                        "measurement": "Watt",
                        "snmp_oid": mib["UPS-MIB::upsBypassPower", *format_index(x)],
                    },
                ]
            )

        return sorted(r, key=lambda x: x["name"])

    def get_chassis_sensors(self):
        return self.get_chassis_sensors_default()
