# ----------------------------------------------------------------------
# Migrate ActionCommand.disable_when_change
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from pymongo import UpdateMany

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    def migrate(self):
        coll = self.mongo_db["noc.actioncommands"]
        r = []
        for doc in coll.aggregate(
            [
                {"$match": {"disable_when_change": {"$in": [True, False]}}},
                {"$group": {"_id": "$disable_when_change", "items": {"$push": "$_id"}}},
            ]
        ):
            items = doc.get("items")
            if not items:
                continue
            r.append(
                UpdateMany(
                    {"_id": {"$in": items}},
                    {"$set": {"disable_when_change": "N" if doc["_id"] else "N"}},
                )
            )
        if r:
            coll.bulk_write(r)
