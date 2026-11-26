# ----------------------------------------------------------------------
# Migrate FM category collections to DocCategory
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import logging

# Third-party modules
from pymongo.errors import DuplicateKeyError

# NOC modules
from noc.core.migration.base import BaseMigration

logger = logging.getLogger("migration")

DOC_CATEGORIES = "noc.doccategories"

# Old category collection => owner model collection
OLD_CATEGORIES = {
    "noc.eventclasscategories": "noc.eventclasses",
    "noc.alartmclasscategories": "noc.alarmclasses",
    "noc.eventclassificationrulecategories": "noc.eventclassificationrules",
}


class Migration(BaseMigration):
    """
    Move EventClass/AlarmClass/EventClassificationRule categories
    to the common DocCategory collection and drop old collections.

    Category _ids are preserved, so existing ``category`` references
    on owner documents stay valid.
    """

    def migrate(self) -> None:
        doc_cat = self.mongo_db[DOC_CATEGORIES]
        for old_coll, type in OLD_CATEGORIES.items():
            coll = self.mongo_db[old_coll]
            docs = list(coll.find())
            if not docs:
                logger.info("Migrating %s: collection is empty, dropping", old_coll)
                coll.drop()
                continue
            # Map old category _id => target DocCategory _id
            id_map: dict = {}
            targets: dict[str, object] = {}
            for d in docs:
                name = d.get("name")
                if name in targets:
                    # Duplicate name: keep the first category, remap the rest
                    logger.warning("Migrating %s: duplicate category %r", old_coll, name)
                    id_map[d["_id"]] = targets[name]
                    continue
                existing = doc_cat.find_one({"type": type, "name": name})
                if existing:
                    target = existing["_id"]
                else:
                    doc = dict(d)
                    doc["type"] = type
                    try:
                        doc_cat.insert_one(doc)
                        target = d["_id"]
                    except DuplicateKeyError:
                        existing = doc_cat.find_one({"type": type, "name": name})
                        if existing is None:
                            raise RuntimeError(
                                f"Cannot resolve category {name!r} in {DOC_CATEGORIES}"
                            )
                        target = existing["_id"]
                targets[name] = target
                id_map[d["_id"]] = target
            # Remap references pointing to duplicated categories
            remap = {old: new for old, new in id_map.items() if old != new}
            if remap:
                owner = self.mongo_db[type]
                for doc in owner.find({"category": {"$in": list(remap)}}):
                    owner.update_one(
                        {"_id": doc["_id"]}, {"$set": {"category": remap[doc["category"]]}}
                    )
                for doc in doc_cat.find({"type": type, "parent": {"$in": list(remap)}}):
                    doc_cat.update_one(
                        {"_id": doc["_id"]}, {"$set": {"parent": remap[doc["parent"]]}}
                    )
            # Verify all owner category references resolve
            valid = {d["_id"] for d in doc_cat.find({"type": type}, {"_id": 1})}
            dangling = self.mongo_db[type].count_documents({"category": {"$nin": list(valid)}})
            if dangling:
                logger.warning("Migrating %s: %d dangling category references", type, dangling)
            # Drop the old collection
            coll.drop()
            logger.info("Migrating %s: moved %d categories to DocCategory", old_coll, len(docs))
