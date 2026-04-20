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
