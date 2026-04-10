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
        ["Environment | Temperature"],
        volatile=False,
        access="S",
    )
    def get_temperature(self, metrics):
        print("*** get_temperature")
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.35.1.0", cached=True)
        if v:
            self.set_metric(
                id=("Environment | Temperature", None),
                labels=["noc::sensor::Temperature 1"],
                value=v,
                multi=True,
                units="C",
            )
        v = self.snmp.get("1.3.6.1.4.1.35265.1.29.35.2.0", cached=True)
        if v:
            self.set_metric(
                id=("Environment | Temperature", None),
                labels=["noc::sensor::Temperature 2"],
                value=v,
                multi=True,
                units="C",
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
        ["Telephony | SIP | Trunk | Enable"],
        volatile=False,
        access="S",
    )
    def get_sip_trunk_enable(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.46.1.1.2",  # trunkName
                "1.3.6.1.4.1.35265.1.29.46.1.1.3",  # trunkEntryType
                "1.3.6.1.4.1.35265.1.29.46.1.1.4",  # trunkEnable
            ],
            bulk=True,
        )
        for _, trunk_name, trunk_type, v in t:
            print("  trunk_metrics", trunk_name, trunk_type, v)
            self.set_metric(
                id=("Telephony | SIP | Trunk | Enable", None),
                labels=[f"noc::sip::trunk::{trunk_name}.{trunk_type}"],
                value=v,
                multi=True,
            )

    @metrics(
        ["Telephony | SIP | Trunk | Capacity"],
        volatile=False,
        access="S",
    )
    def get_sip_trunk_capacity(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.46.1.1.2",  # trunkName
                "1.3.6.1.4.1.35265.1.29.46.1.1.3",  # trunkEntryType
                "1.3.6.1.4.1.35265.1.29.36.1.1.5",  # trunkCapacity
            ],
            bulk=True,
        )
        for _, trunk_name, trunk_type, v in t:
            print("  trunk_metrics", trunk_name, trunk_type, v)
            if v is not None:
                self.set_metric(
                    id=("Telephony | SIP | Trunk | Capacity", None),
                    labels=[f"noc::sip::trunk::{trunk_name}.{trunk_type}"],
                    value=v,
                    multi=True,
                )

    @metrics(
        ["Telephony | SIP | Trunk | CurrentIngressCalls"],
        volatile=False,
        access="S",
    )
    def get_sip_trunk_current_ingress_calls(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.46.1.1.2",  # trunkName
                "1.3.6.1.4.1.35265.1.29.46.1.1.3",  # trunkEntryType
                "1.3.6.1.4.1.35265.1.29.36.1.1.6",  # trunkCurrentIngressCalls
            ],
            bulk=True,
        )
        for _, trunk_name, trunk_type, v in t:
            print("  trunk_metrics", trunk_name, trunk_type, v)
            if v is not None:
                self.set_metric(
                    id=("Telephony | SIP | Trunk | CurrentIngressCalls", None),
                    labels=[f"noc::sip::trunk::{trunk_name}.{trunk_type}"],
                    value=v,
                    multi=True,
                )

    @metrics(
        ["Telephony | SIP | Trunk | CurrentEgressCalls"],
        volatile=False,
        access="S",
    )
    def get_sip_trunk_current_egress_calls(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.46.1.1.2",  # trunkName
                "1.3.6.1.4.1.35265.1.29.46.1.1.3",  # trunkEntryType
                "1.3.6.1.4.1.35265.1.29.36.1.1.7",  # trunkCurrentEgressCalls
            ],
            bulk=True,
        )
        for _, trunk_name, trunk_type, v in t:
            print("  trunk_metrics", trunk_name, trunk_type, v)
            if v is not None:
                self.set_metric(
                    id=("Telephony | SIP | Trunk | CurrentEgressCalls", None),
                    labels=[f"noc::sip::trunk::{trunk_name}.{trunk_type}"],
                    value=v,
                    multi=True,
                )

    @metrics(
        ["Telephony | SIP | Trunk | CurrentTotalCalls"],
        volatile=False,
        access="S",
    )
    def get_sip_trunk_current_total_calls(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.3.6.1.4.1.35265.1.29.46.1.1.2",  # trunkName
                "1.3.6.1.4.1.35265.1.29.46.1.1.3",  # trunkEntryType
                "1.3.6.1.4.1.35265.1.29.36.1.1.8",  # trunkCurrentTotalCalls
            ],
            bulk=True,
        )
        for _, trunk_name, trunk_type, v in t:
            print("  trunk_metrics", trunk_name, trunk_type, v)
            if v is not None:
                self.set_metric(
                    id=("Telephony | SIP | Trunk | CurrentTotalCalls", None),
                    labels=[f"noc::sip::trunk::{trunk_name}.{trunk_type}"],
                    value=v,
                    multi=True,
                )
