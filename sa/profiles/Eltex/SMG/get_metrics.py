# ----------------------------------------------------------------------
# Eltex.SMG.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_metrics import Script as GetMetricsScript, metrics

CPU_USAGE_TYPE_MAP = {
    "cpuUsr": 1,
    "cpuSys": 2,
    "cpuIdle": 3,
}

POWER_METRIC_TYPE_MAP = {
    "pmExist": 1,
    "pmPower": 2,
}


class Script(GetMetricsScript):
    name = "Eltex.SMG.get_metrics"

    @metrics(
        ["CPU | Usage"],
        volatile=False,
        access="S",
    )
    def get_cpu_usage(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.37.1.2",  # cpuUsr
                "1.3.6.1.4.1.35265.1.29.37.1.3",  # cpuSys
                "1.3.6.1.4.1.35265.1.29.37.1.5",  # cpuIdle
            ],
            bulk=True,
        )
        print("  t", t, type(t))
        for core_metrics in t:
            print("  core_metrics", core_metrics, type(core_metrics))
            core_number = core_metrics[0]
            for cpu_usage_type, idx in CPU_USAGE_TYPE_MAP.items():
                cpu_usage = core_metrics[idx]
                try:
                    self.set_metric(
                        id=("CPU | Usage", None),
                        value=int(cpu_usage.split(".")[0]),
                        labels=[f"noc::cpu::{core_number}.{cpu_usage_type}"],
                        multi=True,
                        units="%",
                    )
                except ValueError:
                    pass

    @metrics(
        ["Memory | Usage"],
        volatile=False,
        access="S",
    )
    def get_memory_free(self, metrics):
        ram_free = self.snmp.get("1.3.6.1.4.1.35265.1.29.33.0", cached=True)
        if ram_free:
            mem_usage = float(ram_free)
            self.set_metric(
                id=("Memory | Usage", None),
                value=int(mem_usage),
                multi=True,
                units="kb",
            )

    @metrics(
        ["Environment | Sensor Status"],
        volatile=False,
        access="S",
    )
    def get_sensor_status(self, metrics):
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.35.3.0", cached=True)
        if v:
            self.set_metric(
                id=("Environment | Sensor Status", None),
                labels=["noc::sensor::Fan Rotate"],
                value=v,
                multi=True,
            )
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.35.4.0", cached=True)
        if v:
            self.set_metric(
                id=("Environment | Sensor Status", None),
                labels=["noc::sensor::Fan 1 Rotate"],
                value=v,
                multi=True,
            )
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.35.5.0", cached=True)
        if v:
            self.set_metric(
                id=("Environment | Sensor Status", None),
                labels=["noc::sensor::Fan 2 Rotate"],
                value=v,
                multi=True,
            )
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.35.6.0", cached=True)
        if v:
            self.set_metric(
                id=("Environment | Sensor Status", None),
                labels=["noc::sensor::Fan 3 Rotate"],
                value=v,
                multi=True,
            )

        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.36.1.2",  # pmExist
                "1.3.6.1.4.1.35265.1.29.36.1.3",  # pmPower
            ],
            bulk=True,
        )
        print("  t", t, type(t))
        for module_metrics in t:
            print("  module_metrics", module_metrics, type(module_metrics))
            module_number = module_metrics[0]
            for metric_type, idx in POWER_METRIC_TYPE_MAP.items():
                metric_value = module_metrics[idx]
                self.set_metric(
                    id=("Environment | Sensor Status", None),
                    labels=[f"noc::sensor::Device Power::{module_number}.{metric_type}"],
                    value=metric_value,
                    multi=True,
                )

    @metrics(
        [
            "Telephony | SIP | Trunk | Enable",
            "Telephony | SIP | Trunk | Capacity",
            "Telephony | SIP | Trunk | CurrentIngressCalls",
            "Telephony | SIP | Trunk | CurrentEgressCalls",
            "Telephony | SIP | Trunk | CurrentTotalCalls",
            "Telephony | SIP | Trunk | CurrentCps",
            "Telephony | SIP | Trunk | Status",
            "Telephony | SIP | Trunk | UnavailableCicCount",
            "Telephony | SIP | Trunk | CPSMax",
            "Telephony | SIP | Trunk | CPSAlarm",
            "Telephony | SIP | Trunk | ChansFree",
            "Telephony | SIP | Trunk | ChansBusy",
        ],
        volatile=False,
        access="S",
    )
    def get_sip_trunk_metrics(self, metrics):
        metric_oid_map = {
            "Telephony | SIP | Trunk | Enable": "1.3.6.1.4.1.35265.1.29.46.1.1.4",
            "Telephony | SIP | Trunk | Capacity": "1.3.6.1.4.1.35265.1.29.46.1.1.5",
            "Telephony | SIP | Trunk | CurrentIngressCalls": "1.3.6.1.4.1.35265.1.29.46.1.1.6",
            "Telephony | SIP | Trunk | CurrentEgressCalls": "1.3.6.1.4.1.35265.1.29.46.1.1.7",
            "Telephony | SIP | Trunk | CurrentTotalCalls": "1.3.6.1.4.1.35265.1.29.46.1.1.8",
            "Telephony | SIP | Trunk | CurrentCps": "1.3.6.1.4.1.35265.1.29.46.1.1.9",
            "Telephony | SIP | Trunk | Status": "1.3.6.1.4.1.35265.1.29.46.1.1.10",
            "Telephony | SIP | Trunk | UnavailableCicCount": "1.3.6.1.4.1.35265.1.29.46.1.1.11",
            "Telephony | SIP | Trunk | CPSMax": "1.3.6.1.4.1.35265.1.29.46.1.1.12",
            "Telephony | SIP | Trunk | CPSAlarm": "1.3.6.1.4.1.35265.1.29.46.1.1.13",
            "Telephony | SIP | Trunk | ChansFree": "1.3.6.1.4.1.35265.1.29.46.1.1.14",
            "Telephony | SIP | Trunk | ChansBusy": "1.3.6.1.4.1.35265.1.29.46.1.1.15",
        }
        print("***** metrics", metrics, type(metrics), len(metrics))
        m = metrics[0]
        print("***** m", m, type(m))
        metric_oid = metric_oid_map[m.metric]
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.46.1.1.2",  # trunkName
                "1.3.6.1.4.1.35265.1.29.46.1.1.3",  # trunkEntryType
                metric_oid,
            ],
            bulk=True,
        )
        for _, trunk_name, trunk_type, value in t:
            self.set_metric(
                id=(m.metric, None),
                labels=[f"noc::sip::trunk::{trunk_name}.{trunk_type}"],
                value=value,
                multi=True,
            )
