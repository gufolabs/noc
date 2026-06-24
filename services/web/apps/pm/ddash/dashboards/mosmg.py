# ---------------------------------------------------------------------
# DVBC dynamic dashboard
# ---------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-Party modules
from collections import defaultdict
from mongoengine.queryset.visitor import Q as m_q

# NOC modules
from .mo import MODashboard
from noc.core.text import alnum_key
from noc.inv.models.interface import Interface
from noc.inv.models.object import Object
from noc.inv.models.sensor import Sensor
from noc.pm.models.metrictype import MetricType

TITLE_BAD_CHARS = '"\\\n\r'


class MOSMGDashboard(MODashboard):
    name = "mosmg"
    template = "dash_mosmg.j2"
    has_capability = "Network | SMG"

    TRUNK_METRICS = [
        "trunkEnable",
        "trunkCapacity",
        "trunkCurrentIngressCalls",
        "trunkCurrentEgressCalls",
        "trunkCurrentTotalCalls",
        "trunkCurrentCps",
        "trunkStatus",
        "trunkUnavailableCicCount",
        "trunkCPSMax",
        "trunkCPSAlarm",
        "trunkChansFree",
        "trunkChansBusy",
    ]

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
            om += [mt.name]
        object_metrics.extend(sorted(om))
        # Sensors
        sensor_types = defaultdict(list)
        sensor_enum = []
        fan_sensors = []
        pm_sensors = []
        trunk_group_sensors = {}
        o = Object.get_managed(self.object.id) or []
        for s in Sensor.objects.filter(m_q(managed_object=self.object) | m_q(object__in=o)):
            s_type = s.profile.name
            if not s.state.is_productive:
                s_type = "missed"
            if s.munits.enum and s.state.is_productive:
                sensor_enum += [{"bi_id": s.bi_id, "local_id": s.local_id, "units": s.munits}]
            sensor_types[s_type] += [
                {
                    "label": s.dashboard_label or s.label,
                    "units": s.munits,
                    "bi_id": s.bi_id,
                    "local_id": s.local_id,
                    "profile": s.profile,
                    "id": int(str(s.bi_id)[-10:]),
                }
            ]
            # Fans sensors
            if s.local_id.startswith("smgFan"):
                fan_sensors.append(
                    {
                        "label": s.dashboard_label or s.label,
                        "units": s.munits,
                        "bi_id": s.bi_id,
                        "local_id": s.local_id,
                        "id": int(str(s.bi_id)[-10:]),
                    }
                )
            # Power module sensors
            if s.local_id.endswith(".pmExist") or s.local_id.endswith(".pmPower"):
                pm_sensors.append(
                    {
                        "label": s.dashboard_label or s.label,
                        "units": s.munits,
                        "bi_id": s.bi_id,
                        "local_id": s.local_id,
                        "id": int(str(s.bi_id)[-10:]),
                    }
                )
            # Trunk group sensors
            for metric in self.TRUNK_METRICS:
                if s.local_id.endswith(f".{metric}"):
                    trunk_group_sensors[s.local_id] = s
        # Trunk groups
        trunk_groups = []
        for s_name, s in trunk_group_sensors.items():
            t_g, _ = s_name.rsplit(".", 1)
            if t_g not in trunk_groups:
                trunk_groups.append(t_g)
        trunk_groups = sorted(trunk_groups)
        # Trunk groups data
        trunk_groups_data = {}
        for tg_name in trunk_groups:
            tg_data = []
            for metric in self.TRUNK_METRICS:
                sensor_local_id = f"{tg_name}.{metric}"
                s = trunk_group_sensors[sensor_local_id]
                tg_data.append(
                    {
                        "label": s.dashboard_label or s.label,
                        "units": str(s.munits),
                        "bi_id": s.bi_id,
                        "local_id": s.local_id,
                        "id": int(str(s.bi_id)[-10:]),
                    }
                )
                # temporary solution
                if metric == "trunkCapacity":
                    tg_data[-1]["label"] = "Capacity"
            trunk_groups_data[tg_name] = tg_data
        # Trunk groups data (enable, status)
        trunk_groups_data_en_st = {}
        for tg_name in trunk_groups:
            tg_data = []
            s = trunk_group_sensors[f"{tg_name}.trunkEnable"]
            s_2 = trunk_group_sensors[f"{tg_name}.trunkStatus"]
            tg_data.append(
                {
                    "label": s.dashboard_label or s.label,
                    "units": str(s.munits),
                    "bi_id": s.bi_id,
                    "bi_ids": [s.bi_id, s_2.bi_id],
                    "local_id": s.local_id,
                    "id": int(str(s.bi_id)[-10:]),
                }
            )
            trunk_groups_data_en_st[tg_name] = tg_data
        # Trunk groups data (calls)
        trunk_groups_data_calls = {}
        for tg_name in trunk_groups:
            tg_data = []
            s = trunk_group_sensors[f"{tg_name}.trunkCurrentIngressCalls"]
            s_2 = trunk_group_sensors[f"{tg_name}.trunkCurrentEgressCalls"]
            s_3 = trunk_group_sensors[f"{tg_name}.trunkCurrentTotalCalls"]
            tg_data.append(
                {
                    "label": s.dashboard_label or s.label,
                    "units": str(s.munits),
                    "bi_id": s.bi_id,
                    "bi_ids": [s.bi_id, s_2.bi_id, s_3.bi_id],
                    "local_id": s.local_id,
                    "id": int(str(s.bi_id)[-10:]),
                }
            )
            trunk_groups_data_calls[tg_name] = tg_data
        # Trunk groups data (CPS)
        trunk_groups_data_cps = {}
        for tg_name in trunk_groups:
            tg_data = []
            s = trunk_group_sensors[f"{tg_name}.trunkCurrentCps"]
            s_2 = trunk_group_sensors[f"{tg_name}.trunkCPSMax"]
            s_3 = trunk_group_sensors[f"{tg_name}.trunkCPSAlarm"]
            tg_data.append(
                {
                    "label": s.dashboard_label or s.label,
                    "units": str(s.munits),
                    "bi_id": s.bi_id,
                    "bi_ids": [s.bi_id, s_2.bi_id, s_3.bi_id],
                    "local_id": s.local_id,
                    "id": int(str(s.bi_id)[-10:]),
                }
            )
            trunk_groups_data_cps[tg_name] = tg_data
        # Trunk groups data (channels)
        trunk_groups_data_channels = {}
        for tg_name in trunk_groups:
            tg_data = []
            s = trunk_group_sensors[f"{tg_name}.trunkChansFree"]
            s_2 = trunk_group_sensors[f"{tg_name}.trunkChansBusy"]
            s_3 = trunk_group_sensors[f"{tg_name}.trunkUnavailableCicCount"]
            tg_data.append(
                {
                    "label": s.dashboard_label or s.label,
                    "units": str(s.munits),
                    "bi_id": s.bi_id,
                    "bi_ids": [s.bi_id, s_2.bi_id, s_3.bi_id],
                    "local_id": s.local_id,
                    "id": int(str(s.bi_id)[-10:]),
                }
            )
            trunk_groups_data_channels[tg_name] = tg_data
        return {
            "port_types": port_types,
            "selected_types": selected_types,
            "object_metrics": object_metrics,
            "sensor_enum": sensor_enum,
            "sensor_types": sensor_types,
            "fan_sensors": fan_sensors,
            "pm_sensors": pm_sensors,
            "trunk_groups": trunk_groups,
            "trunk_groups_data": trunk_groups_data,
            "trunk_groups_data_en_st": trunk_groups_data_en_st,
            "trunk_groups_data_calls": trunk_groups_data_calls,
            "trunk_groups_data_cps": trunk_groups_data_cps,
            "trunk_groups_data_channels": trunk_groups_data_channels,
            "trunk_metrics": self.TRUNK_METRICS,
        }

    def get_context(self):
        return {
            "port_types": self.object_data["port_types"],
            "selected_types": self.object_data["selected_types"],
            "object_metrics": self.object_data["object_metrics"],
            "device": self.object.name.replace('"', ""),
            "ip": self.object.address,
            "platform": self.object.platform.name if self.object.platform else "Unknown platform",
            "device_id": self.object.id,
            "firmare_version": self.object.version.version if self.object.version else None,
            "segment": self.object.segment.id,
            "vendor": self.object.vendor or "Unknown version",
            "sensor_enum": self.object_data["sensor_enum"],
            "sensor_types": self.object_data["sensor_types"],
            "fan_sensors": self.object_data["fan_sensors"],
            "pm_sensors": self.object_data["pm_sensors"],
            "trunk_groups": self.object_data["trunk_groups"],
            "trunk_groups_data": self.object_data["trunk_groups_data"],
            "trunk_groups_data_en_st": self.object_data["trunk_groups_data_en_st"],
            "trunk_groups_data_calls": self.object_data["trunk_groups_data_calls"],
            "trunk_groups_data_cps": self.object_data["trunk_groups_data_cps"],
            "trunk_groups_data_channels": self.object_data["trunk_groups_data_channels"],
            "trunk_metrics": self.object_data["trunk_metrics"],
            "bi_id": self.object.bi_id,
            "pool": self.object.pool.name,
            "extra_template": self.extra_template,
            "extra_vars": self.extra_vars,
            "ping_interval": self.object.object_profile.ping_interval,
            "discovery_interval": int(self.object.get_metric_discovery_interval() / 2),
        }
