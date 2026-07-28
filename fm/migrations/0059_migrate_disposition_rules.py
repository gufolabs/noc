# ----------------------------------------------------------------------
# Move Event Class handlers to Event Disposition Rule
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import uuid
from typing import Any

# Third-party modules
import bson
from pymongo import InsertOne

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.bi.decorator import new_bi_id

interaction_map = {
    "log_cmd": 0,
    "log_login": 1,
    "log_logout": 2,
    "log_reboot": 3,
    "log_started": 4,
    "log_halted": 5,
    "log_config_changed": 6,
    "on_system_start": 4,
    "on_config_change": 6,
}
discovery_funcs = {"on_system_start", "on_config_change", "schedule_discovery"}
action_map = {"raise": "R", "clear": "C", "ignore": "I", "drop": "I"}


class Migration(BaseMigration):
    @staticmethod
    def get_object_actions(handlers: list[str] | None) -> dict[str, Any] | None:
        if not handlers:
            return None
        interaction = None
        discovery = False
        for h in handlers:
            _, function = h.rsplit(".", 1)
            if function in interaction_map:
                interaction = interaction_map[function]
            if function in discovery_funcs:
                discovery = True
        if interaction is None and not discovery:
            return None
        return {
            "interaction_audit": interaction,
            "run_discovery": discovery,
        }

    def migrate(self) -> None:
        bulk = []
        seen: set[str] = set()
        ac_map = {
            ac["_id"]: ac["name"] for ac in self.mongo_db["noc.alarmclasses"].find({}, {"name": 1})
        }
        for ec in self.mongo_db["noc.eventclasses"].find(
            {
                "$or": [
                    {"disposition.0": {"$exists": True}},
                    {"handlers.0": {"$exists": True}},
                ]
            },
            {"name": 1, "disposition": 1, "handlers": 1},
        ):
            disposition_names: dict[str, int] = {}
            for d in ec["disposition"] or []:
                ac = d.get("alarm_class")
                if not ac:
                    continue
                idx = disposition_names.get(d["name"], 0)
                if idx:
                    name = f"{ec['name']} ({ac_map.get(ac)},{d['name']}) ({idx})"
                else:
                    name = f"{ec['name']} ({ac_map.get(ac)},{d['name']})"
                disposition_names[d["name"]] = idx + 1
                if name in seen:
                    continue
                da = action_map.get(d["action"], "I")
                r = {
                    "name": name,
                    "uuid": uuid.uuid5(uuid.NAMESPACE_OID, name),
                    "is_active": True,
                    "combo_condition": d["combo_condition"],
                    "combo_window": d.get("combo_window") or 0,
                    "combo_count": d.get("combo_count") or 0,
                    "alarm_disposition": d.get("alarm_class"),
                    "default_action": da,
                    "conditions": [{"event_class_re": ec["name"]}],
                    "bi_id": bson.Int64(new_bi_id()),
                }
                if actions := self.get_object_actions(ec.get("handlers")):
                    r["object_actions"] = actions
                bulk.append(InsertOne(r))
                seen.add(name)
            if ec.get("disposition"):
                continue
            name = f"{ec['name']} (handlers)"
            r = {
                "name": name,
                "uuid": uuid.uuid5(uuid.NAMESPACE_OID, name),
                "is_active": True,
                "handlers": [],
                "conditions": [{"event_class_re": ec["name"]}],
                "bi_id": bson.Int64(new_bi_id()),
            }
            if actions := self.get_object_actions(ec.get("handlers")):
                r["object_actions"] = actions
            bulk.append(InsertOne(r))
        if bulk:
            self.mongo_db["dispositionrules"].bulk_write(bulk)
