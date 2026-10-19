# ---------------------------------------------------------------------
# SBC dynamic dashboard
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python Modules
import datetime

# Third-Party modules
from collections import defaultdict

# NOC modules
from .mo import MODashboard
from noc.core.clickhouse.connect import connection
from noc.core.text import alnum_key
from noc.inv.models.interface import Interface
from noc.pm.models.metrictype import MetricType

TITLE_BAD_CHARS = '"\\\n\r'


class MOSBCDashboard(MODashboard):
    name = "mosbc"
    template = "dash_mosbc.j2"
    has_capability = "Network | SBC"

    def resolve_object_data(self, object):
        def interface_profile_has_metrics(profile):
            """
            Check interface profile has metrics
            """
            for m in profile.metrics:
                if (
                    m.interval
                    or profile.metrics_default_interval
                    or self.object.object_profile.metrics_default_interval
                ):
                    return True
            return False

        port_types = []
        selected_types = defaultdict(list)
        # Get all interface profiles with configurable metrics
        all_ifaces = list(Interface.objects.filter(managed_object=self.object.id))
        iprof = {i.profile for i in all_ifaces}
        # @todo: Order by priority
        profiles = [p for p in iprof if interface_profile_has_metrics(p)]
        # Create charts for configured interface metrics
        for profile in profiles:
            ifaces = [i for i in all_ifaces if i.profile == profile]
            ports = []
            for iface in sorted(ifaces, key=lambda el: alnum_key(el.name)):
                if iface.type in ("physical", "tunnel"):
                    ports += [
                        {
                            "name": iface.name,
                            "descr": self.str_cleanup(
                                iface.description, remove_letters=TITLE_BAD_CHARS
                            ),
                            "status": iface.status,
                        }
                    ]
            if ports:
                port_types += [{"type": profile.id, "name": profile.name, "ports": ports}]

        object_metrics = []
        if self.object.object_profile.report_ping_rtt:
            object_metrics += ["rtt"]
        om = []
        for m in self.object.object_profile.metrics or []:
            mt = MetricType.get_by_id(m["metric_type"])
            if not mt:
                continue
            if mt.name == "PeerNodes | Value":
                continue
            om += [mt.name]
        object_metrics.extend(sorted(om))

        # Getting agenthosts list for peer_nodes metrics
        today = datetime.date.today()
        date_1 = today.isoformat()
        date_2 = (today + datetime.timedelta(days=30)).isoformat()
        sql = f"""SELECT pn_host FROM object
        WHERE date>='{date_1}' AND date<='{date_2}' AND managed_object={self.object.bi_id} AND pn_host<>''
        GROUP BY pn_host
        ORDER BY pn_host
        """
        ch = connection()
        peer_nodes_hosts = [i[0] for i in ch.execute(sql)]
        return {
            "port_types": port_types,
            "selected_types": selected_types,
            "object_metrics": object_metrics,
            "peer_nodes_hosts": peer_nodes_hosts,
        }

    def get_context(self):
        return {
            "port_types": self.object_data["port_types"],
            "selected_types": self.object_data["selected_types"],
            "object_metrics": self.object_data["object_metrics"],
            "peer_nodes_hosts": self.object_data["peer_nodes_hosts"],
            "device": self.object.name.replace('"', ""),
            "ip": self.object.address,
            "platform": self.object.platform.name if self.object.platform else "Unknown platform",
            "device_id": self.object.id,
            "firmare_version": self.object.version.version if self.object.version else None,
            "segment": self.object.segment.id,
            "vendor": self.object.vendor or "Unknown version",
            "bi_id": self.object.bi_id,
            "pool": self.object.pool.name,
            "extra_template": self.extra_template,
            "extra_vars": self.extra_vars,
            "ping_interval": self.object.object_profile.ping_interval,
            "discovery_interval": int(self.object.get_metric_discovery_interval() / 2),
        }
