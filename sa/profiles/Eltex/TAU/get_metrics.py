# ----------------------------------------------------------------------
# Eltex.TAU.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.script.metrics import percent
from noc.sa.profiles.Generic.get_metrics import Script as GetMetricsScript, metrics


class Script(GetMetricsScript):
    name = "Eltex.TAU.get_metrics"

    @metrics(
        ["CPU | Usage"],
        volatile=False,
        access="S",
    )
    def get_cpu_usage(self, metrics):
        cpu_usage = self.snmp.get("1.3.6.1.4.1.35265.1.9.8.0", cached=True)
        if cpu_usage:
            try:
                self.set_metric(
                    id=("CPU | Usage", None),
                    value=int(cpu_usage.split(".")[0]),
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
            "Telephony | Voice | Calls Count",
            "Telephony | Voice | Lost Packets",
            "Telephony | Voice | Peak Jitter",
        ],
        volatile=False,
        access="S",
    )
    def get_voice_metrics(self, metrics):
        metric_oid_map = {
            "Telephony | Voice | Calls Count": "1.3.6.1.4.1.35265.1.9.23.1.3",
            "Telephony | Voice | Lost Packets": "1.3.6.1.4.1.35265.1.9.23.1.6",
            "Telephony | Voice | Peak Jitter": "1.3.6.1.4.1.35265.1.9.23.1.5",
        }
        m = metrics[0]
        metric_oid = metric_oid_map[m.metric]
        t = self.snmp.get_tables([metric_oid], bulk=True)
        for port_id, value in t:
            self.set_metric(
                id=(m.metric, None),
                labels=[f"noc::voice::port::{port_id}"],
                value=value,
                multi=True,
            )
