# ----------------------------------------------------------------------
# Eltex.SMG.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.script.metrics import percent
from noc.sa.profiles.Generic.get_metrics import Script as GetMetricsScript, metrics

CPU_USAGE_TYPE_MAP = {
    "cpuUsr": 1,
    "cpuSys": 2,
    "cpuNic": 3,
    "cpuIdle": 4,
    "cpuIo": 5,
    "cpuIrq": 6,
    "cpuSirq": 7,
    "cpuUsage": 8,
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
                "1.3.6.1.4.1.35265.1.29.37.1.4",  # cpuNic
                "1.3.6.1.4.1.35265.1.29.37.1.5",  # cpuIdle
                "1.3.6.1.4.1.35265.1.29.37.1.6",  # cpuIo
                "1.3.6.1.4.1.35265.1.29.37.1.7",  # cpuIrq
                "1.3.6.1.4.1.35265.1.29.37.1.8",  # cpuSirq
                "1.3.6.1.4.1.35265.1.29.37.1.9",  # cpuUsage
            ],
            bulk=True,
        )
        for core_metrics in t:
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
    def get_memory_usage(self, metrics):
        mem_real = self.snmp.get("1.3.6.1.4.1.2021.4.5.0", cached=True)  # memTotalReal
        mem_free = self.snmp.get("1.3.6.1.4.1.2021.4.11.0", cached=True)  # memTotalFree
        mem_usage = percent(mem_real - mem_free, mem_real)
        self.set_metric(
            id=("Memory | Usage", None),
            value=int(mem_usage),
            multi=True,
            units="%",
        )

    @metrics(
        [
            "Telephony | Trunk | Enable",
            "Telephony | Trunk | Capacity",
            "Telephony | Trunk | CurrentIngressCalls",
            "Telephony | Trunk | CurrentEgressCalls",
            "Telephony | Trunk | CurrentTotalCalls",
            "Telephony | Trunk | CurrentCps",
            "Telephony | Trunk | Status",
            "Telephony | Trunk | UnavailableCicCount",
            "Telephony | Trunk | CPSMax",
            "Telephony | Trunk | CPSAlarm",
            "Telephony | Trunk | ChansFree",
            "Telephony | Trunk | ChansBusy",
        ],
        volatile=False,
        access="S",
    )
    def get_trunk_metrics(self, metrics):
        metric_oid_map = {
            "Telephony | Trunk | Enable": "1.3.6.1.4.1.35265.1.29.46.1.1.4",
            "Telephony | Trunk | Capacity": "1.3.6.1.4.1.35265.1.29.46.1.1.5",
            "Telephony | Trunk | CurrentIngressCalls": "1.3.6.1.4.1.35265.1.29.46.1.1.6",
            "Telephony | Trunk | CurrentEgressCalls": "1.3.6.1.4.1.35265.1.29.46.1.1.7",
            "Telephony | Trunk | CurrentTotalCalls": "1.3.6.1.4.1.35265.1.29.46.1.1.8",
            "Telephony | Trunk | CurrentCps": "1.3.6.1.4.1.35265.1.29.46.1.1.9",
            "Telephony | Trunk | Status": "1.3.6.1.4.1.35265.1.29.46.1.1.10",
            "Telephony | Trunk | UnavailableCicCount": "1.3.6.1.4.1.35265.1.29.46.1.1.11",
            "Telephony | Trunk | CPSMax": "1.3.6.1.4.1.35265.1.29.46.1.1.12",
            "Telephony | Trunk | CPSAlarm": "1.3.6.1.4.1.35265.1.29.46.1.1.13",
            "Telephony | Trunk | ChansFree": "1.3.6.1.4.1.35265.1.29.46.1.1.14",
            "Telephony | Trunk | ChansBusy": "1.3.6.1.4.1.35265.1.29.46.1.1.15",
        }
        m = metrics[0]
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
                labels=[f"noc::trunk::{trunk_name}.{trunk_type}"],
                value=value,
                multi=True,
            )
