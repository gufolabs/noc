# ----------------------------------------------------------------------
# OmegaTelecom.SBC.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_metrics import Script as GetMetricsScript, metrics

PEER_NODE_METRIC_TYPE_MAP = {
    "omSipSAStatsCurrentActiveSessionsInbound": 2,
    "omSipSAStatsCurrentSessionRateInbound": 3,
    "omSipSAStatsCurrentActiveSessionsOutbound": 4,
    "omSipSAStatsPeriodASR": 5,
    "omSipSAStatsCurrentSessionRate": 6,
}


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

    @metrics(
        ["PeerNodes | Value"],
        # ["Peer | Nodes"],
        volatile=False,
        access="S",
    )
    def get_peer_nodes(self, metrics):
        t = self.snmp.get_tables(
            [
                "1.2.643.2.124.1.3.2.1.2.2.1.2",  # omSipSAStatsSessionAgentHostname
                "1.2.643.2.124.1.3.2.1.2.2.1.4",  # omSipSAStatsCurrentActiveSessionsInbound
                "1.2.643.2.124.1.3.2.1.2.2.1.5",  # omSipSAStatsCurrentSessionRateInbound
                "1.2.643.2.124.1.3.2.1.2.2.1.6",  # omSipSAStatsCurrentActiveSessionsOutbound
                "1.2.643.2.124.1.3.2.1.2.2.1.19",  # omSipSAStatsPeriodASR
                "1.2.643.2.124.1.3.2.1.2.2.1.58",  # omSipSAStatsCurrentSessionRate
            ],
            bulk=True,
        )
        print("  t", t, type(t))
        for node_metrics in t:
            print("  node_metrics", node_metrics, type(node_metrics))
            hostname = node_metrics[1]
            for metric_type, idx in PEER_NODE_METRIC_TYPE_MAP.items():
                metric = node_metrics[idx]

                self.set_metric(
                    id=("PeerNodes | Value", None),
                    value=metric,
                    labels=[f"noc::peer_node::{hostname}.{metric_type}"],
                    multi=True,
                )
