# ---------------------------------------------------------------------
# UPS dynamic dashboard
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-Party modules
from collections import defaultdict

# NOC modules
from .mo import MODashboard
from noc.inv.models.object import Object
from noc.inv.models.sensor import Sensor
from noc.pm.models.metrictype import MetricType

TITLE_BAD_CHARS = '"\\\n\r'


class UPSDashboard(MODashboard):
    name = "moups"
    template = "dash_moups.j2"
    has_capability = "Device | UPS"

    def get_value_mappings(self):
        return {
            "upsBatteryStatus": {
                "1": "unknown",
                "2": "batteryNormal",
                "3": "batteryLow",
                "4": "batteryDepleted",
            },
            "upsOutputSource": {
                "1": "other",
                "2": "none",
                "3": "normal",
                "4": "bypass",
                "5": "battery",
                "6": "booster",
                "7": "reducer",
            },
        }

    def get_value_thresholds(self):
        return {
            "upsBatteryStatus": [
                {"color": "gray", "value": "null"},
                {"color": "red", "value": 1},
                {"color": "green", "value": 2},
                {"color": "red", "value": 3},
                {"color": "red", "value": 4},
            ],
            "upsOutputSource": [
                {"color": "gray", "value": "null"},
                {"color": "gray", "value": 1},
                {"color": "red", "value": 2},
                {"color": "green", "value": 3},
                {"color": "red", "value": 4},
                {"color": "red", "value": 5},
                {"color": "red", "value": 6},
                {"color": "red", "value": 7},
            ],
        }

    def resolve_object_data(self, object):
        object_metrics = []
        if self.object.object_profile.report_ping_rtt:
            object_metrics += ["rtt"]

        om = []
        for metrics in self.object.object_profile.metrics or []:
            mt = MetricType.get_by_id(metrics["metric_type"])
            if not mt:
                continue
            om += [mt.name]
        object_metrics.extend(sorted(om))

        o = Object.get_managed(self.object.id).first() or None
        if not o:
            return {
                "object_metrics": object_metrics,
            }

        value_mappings = self.get_value_mappings()
        value_thresholds = self.get_value_thresholds()
        sensor_enum = []

        sensors = {}
        for s in Sensor.objects.filter(object=o):
            sbname = s.local_id.split(".")[0]
            if not sensors.get(sbname):
                sensors[sbname] = []

            sensors[sbname].append(s)

        graphs = {}
        for sbname in sensors:
            sns = sensors[sbname]
            s = sns[0]
            if s.units.enum:
                sensor_enum += [
                    {
                        "bi_id": s.bi_id,
                        "local_id": s.local_id,
                        "units": s.units,
                        "mappings": value_mappings.get(s.local_id, {}),
                        "thresholds": value_thresholds.get(s.local_id, {}),
                    }
                ]
                continue

            if len(sns) == 1:
                graphs[sbname] = {
                    "label": s.dashboard_label or s.label,
                    "units": s.units,
                    "bi_id": s.bi_id,
                    "local_id": s.local_id,
                    "profile": s.profile,
                    "id": int(str(s.bi_id)[-10:]),
                }
                continue

            graphs[sbname] = {
                "label": sns[0].dashboard_label or sns[0].label,
                "units": sns[0].units,
                "local_id": sbname,
                "profile": sns[0].profile,
                "series": [
                    {
                        "label": s.dashboard_label or s.label,
                        "units": s.units,
                        "bi_id": s.bi_id,
                        "local_id": s.local_id,
                        "profile": s.profile,
                        "id": int(str(s.bi_id)[-10:]),
                    }
                    for s in sns
                ],
                "id": int(str(sns[0].bi_id)[-10:]),
            }

        return {
            "object_metrics": object_metrics,
            "sensor_enum": sensor_enum,
            "graphs": graphs,
        }

    def get_context(self):
        # For debug only
        # o_data = self.object_data
        # graphs = self.object_data["graphs"]

        return {
            "object_metrics": self.object_data["object_metrics"],
            "device": self.object.name.replace('"', ""),
            "ip": self.object.address,
            "platform": self.object.platform.name if self.object.platform else "Unknown platform",
            "device_id": self.object.id,
            "firmare_version": self.object.version.version if self.object.version else None,
            "segment": self.object.segment.id,
            "vendor": self.object.vendor or "Unknown version",
            "sensor_enum": self.object_data["sensor_enum"],
            "graphs": self.object_data["graphs"],
            "bi_id": self.object.bi_id,
            "pool": self.object.pool.name,
            "selected_types": defaultdict(list),
            "ping_interval": self.object.object_profile.ping_interval,
            "discovery_interval": int(self.object.object_profile.periodic_discovery_interval / 2),
        }
