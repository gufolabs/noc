# ----------------------------------------------------------------------
# OmegaTelecom.SBC.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_metrics import Script as GetMetricsScript, metrics


class Script(GetMetricsScript):
    name = "OmegaTelecom.SBC.get_metrics"

    @metrics(
        ["CPU | Usage"],
        volatile=False,
        access="S",
    )
    def get_cpu_usage(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.2.643.2.124.1.3.17.1.2.1.1.1.2",  # omThreadName
                "1.2.643.2.124.1.3.17.1.2.1.1.1.3",  # omThreadCurrentUsage
            ],
            bulk=True,
        )
        print("  t", t, type(t))
        for thread_metrics in t:
            print("  thread_metrics", thread_metrics, type(thread_metrics))
            _, thread_name, thread_usage = thread_metrics
            self.set_metric(
                id=("CPU | Usage", None),
                value=thread_usage,
                labels=[f"noc::cpu::{thread_name}"],
                multi=True,
                units="%",
            )
