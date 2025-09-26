# ---------------------------------------------------------------------
# Migrate segment settings
# ---------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import datetime
import logging

# Third-party applications
from bson import ObjectId

# NOC modules
from noc.core.migration.base import BaseMigration

logger = logging.getLogger(__name__)


class Migration(BaseMigration):
    def migrate(self):
        mdb = self.mongo_db
        segments = mdb.noc.networksegments
        cstate = mdb.noc.inv.networkchartstate
        msettings = mdb.noc.mapsettings
        for cid, name, description, selector_id in self.db.execute(
            "SELECT id, name, description, selector_id FROM inv_networkchart"
        ):
            logger.info("Migrating chart '%s'", name)
            # Create segment
            sid = ObjectId()
            segments.insert(
                {
                    "_id": sid,
                    "name": name,
                    "description": description,
                    "settings": {},
                    "selector": selector_id,
                }
            )
            # Get state
            nodes = []
            mx = 0.0
            my = 0.0
            for s in cstate.find({"chart": cid, "type": "mo"}):
                # object, state: {x, y, w, h}
                if "x" not in s["state"] or "y" not in s["state"]:
                    continue
                x = float(s["state"]["x"])
                y = float(s["state"]["y"])
                mx = max(mx, x)
                my = max(my, y)
                nodes += [{"type": "managedobject", "id": str(s["object"]), "x": x, "y": y}]
            if nodes:
                msettings.insert(
                    {
                        "segment": str(sid),
                        "changed": datetime.datetime.now(),
                        "user": "migration",
                        "nodes": nodes,
                        "links": [],
                        "width": mx + 70,
                        "height": my + 70,
                    }
                )
        self.db.delete_table("inv_networkchart")
        cstate.drop()
