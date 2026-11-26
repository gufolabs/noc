# ----------------------------------------------------------------------
# Collection utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import hashlib
import operator
import sys
import threading
import zlib
from abc import ABC, abstractmethod
from base64 import b85decode
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import Any, ClassVar, NamedTuple, Self, TextIO, cast
from uuid import UUID

# Third-party modules
import bson
import cachetools
import orjson
from django.db.utils import IntegrityError
from mongoengine.document import Document
from mongoengine.errors import NotUniqueError
from mongoengine.fields import (
    BinaryField,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    ListField,
    ReferenceField,
)
from pymongo import UpdateOne
from pymongo.collection import Collection as PymongoCollection

# NOC modules
from noc.config import config
from noc.core.comp import smart_bytes
from noc.core.fileutils import safe_rewrite
from noc.core.model.base import NOCModel
from noc.core.mongo.connection import get_db
from noc.models import COLLECTIONS, DB_MODEL_INSTANCE, DB_MODEL_TYPE, get_model, is_document

state_lock = threading.Lock()


@dataclass
class Item:
    """
    Object in collection.

    Attributes:
        uuid: Item's UUID
        path: File path
        hash: Item's hash
        data: Data
    """

    uuid: str
    path: Path
    hash: str
    data: dict[str, Any]


class RefKey(NamedTuple):
    """
    Lookup cache key.

    Attributes:
        ref: Document class
        field: Field name
        key: Field value
    """

    ref: type[Document]
    field: str
    key: str


class BaseCollection[T: DB_MODEL_TYPE](ABC):
    """
    Base class for collection synchronisation.

    A collection wraps a model class (Django model or mongoengine document)
    and synchronises its JSON representation from files to the database.
    Use the get_by_name() factory or iter_collections() to get instances.

    Subclasses:
        ModelCollection: Django models
        DocumentCollection: mongoengine documents
    """

    PREFIX = "collections"
    STATE_COLLECTION = "noc.collectionstates"
    DEFAULT_API_VERSION = 1

    _api_version: int | str  # API version prefix for item hashes

    _MODELS: ClassVar[dict[str, DB_MODEL_TYPE]] = {}

    _state_cache: ClassVar[cachetools.TTLCache[str, set[str]]] = cachetools.TTLCache(
        maxsize=100, ttl=60
    )

    def __init__(self, model: T, stdout: TextIO | None = None) -> None:
        self.model = model
        self.name = self.get_collection_name(model)
        self._api_version = self.DEFAULT_API_VERSION
        self.ref_cache: dict[RefKey, Document] = {}
        self._name_field: str | None = None
        self.stdout = stdout or sys.stdout
        self.partial_errors: dict[str, str] = {}
        self._is_clean = self.is_clean()

    # ------------------------------------------------------------------
    # Factories
    # ------------------------------------------------------------------

    @classmethod
    @abstractmethod
    def get_collection_name(cls, model: T) -> str:
        """
        Return json collection name for the model class.

        Args:
            model: Model class (Django model or mongoengine document).

        Returns:
            Collection name, e.g. "fm.alarmclasses".
        """

    @classmethod
    def load_models(cls) -> dict[str, DB_MODEL_TYPE]:
        """
        Return the name -> model class index, filling it lazily.

        Returns:
            Result of return the name -> model class index.
        """
        if not cls._MODELS:
            for c in COLLECTIONS:
                cm = get_model(c)
                cls._MODELS[cls.create(cm).name] = cm
        return cls._MODELS

    @classmethod
    def create(cls, model: DB_MODEL_TYPE) -> Self:
        """
        Create proper collection instance for the model class.

        Args:
            model: Model class (Django model or mongoengine document).
        """
        if is_document(model):
            return cast(Self, DocumentCollection(cast(type[Document], model)))
        return cast(Self, ModelCollection(cast(type[NOCModel], model)))

    @classmethod
    def get_by_name(cls, name: str) -> Self:
        """
        Return collection instance for the given collection name.

        Args:
            name: Collection name, e.g. "fm.alarmclasses".

        Raises:
            ValueError: If collection name is unknown.
        """
        try:
            model = cls.load_models()[name]
        except KeyError:
            msg = f"Unknown collection: {name}"
            raise ValueError(msg) from None
        return cls.create(model)

    @classmethod
    def iter_collections(cls) -> Iterable[Self]:
        """Yield collection instances for all known models."""
        for model in cls.load_models().values():
            yield cls.create(model)

    # ------------------------------------------------------------------
    # State
    # ------------------------------------------------------------------

    def iter_path(self) -> Iterable[Path]:
        """Get directories containing collection items."""
        for cp in config.get_customized_paths(self.PREFIX, prefer_custom=True):
            path = Path(cp, self.name)
            if path.exists():
                yield path

    @property
    def name_field(self) -> str:
        if self._name_field:
            return self._name_field
        nf = self._find_name_field()
        if not nf:
            raise ValueError("Cannot find name field")
        self._name_field = nf
        return nf

    def _find_name_field(self) -> str | None:
        """
        Find the field used to display an item's name.

        Returns:
            Field name, or None if not found.
        """
        if hasattr(self.model, "name"):
            return "name"
        if hasattr(self.model, "json_name"):
            return "json_name"
        return None

    def get_state_collection(self) -> PymongoCollection:
        """Return mongo collection for state."""
        return get_db()[self.STATE_COLLECTION]

    def get_state(self) -> dict[str, str]:
        """Return collection state as a dict of UUID -> hash."""
        coll = self.get_state_collection()
        # Get state from database
        cs = coll.find_one({"_id": self.name})
        if cs:
            return orjson.loads(zlib.decompress(smart_bytes(cs["state"])))
        return {}

    def save_state(self, state: dict[str, str]) -> None:
        """Save collection state."""
        coll = self.get_state_collection()
        coll.update_one(
            {"_id": self.name},
            {"$set": {"state": bson.Binary(zlib.compress(orjson.dumps(state)))}},
            upsert=True,
        )

    @classmethod
    @cachetools.cachedmethod(operator.attrgetter("_state_cache"), lock=lambda _: state_lock)
    def get_builtins(cls, name: str) -> set[str]:
        """Return the set of UUIDs stored in the collection state."""
        return set(cls.get_by_name(name).get_state())

    # ------------------------------------------------------------------
    # Items
    # ------------------------------------------------------------------

    def item_hash(self, data: dict[str, Any]) -> str:
        """
        Calculate item hash.

        Args:
            data: Data record.

        Returns:
            Calculated hash
        """
        h = hashlib.sha256(orjson.dumps(data)).hexdigest()
        if self._api_version == self.DEFAULT_API_VERSION:
            return h
        return f"{self._api_version}:{h}"

    def get_items(self) -> dict[str, Item]:
        """
        Returns dict of UUID -> Item containing new state.
        """
        items = {}
        for p in self.iter_path():
            for fp in p.rglob("*.json"):
                if fp.name.startswith("."):
                    continue
                for item in self.iter_items_from_file(fp):
                    if item.uuid not in items:
                        items[item.uuid] = item
        return items

    def iter_items_from_file(self, path: Path) -> Iterable[Item]:
        """
        Iterate all items from file.
        """

        def get_single(data: dict[str, Any]) -> Item:
            """Return single item."""
            if "uuid" not in data:
                msg = f"Invalid JSON {path}: No UUID"
                raise ValueError(msg)
            return Item(uuid=data["uuid"], path=path, hash=self.item_hash(data), data=data)

        def iter_bundle(data: dict[str, Any]) -> Iterable[Item]:
            items = data.get("items")
            if not items:
                return
            for item in items:
                yield get_single(item)

        # Read file
        with open(path) as f:
            try:
                data = orjson.loads(f.read())
            except ValueError as e:
                msg = f"Error load {path}: {e}"
                raise ValueError(msg)
        if not isinstance(data, dict):
            raise ValueError("must be dict")
        # Read items
        if data.get("$type") == "bundle":
            yield from iter_bundle(data)
        else:
            yield get_single(data)

    @abstractmethod
    def get_fields(self, model: DB_MODEL_TYPE | None = None) -> dict[str, Any]:
        """
        Return the field name -> field mapping for the model.

        Args:
            model: Target model or embedded document class.
        """

    @abstractmethod
    def get_unique_fields(self) -> list[str | tuple[str, ...]]:
        """
        Return the model's unique field constraints from the collection meta.

        Returns:
            List of unique constraints: a single field name or a tuple of fields.
        """

    def dereference(self, d: dict[str, Any], model: DB_MODEL_TYPE | None = None) -> dict[str, Any]:
        """
        Dereference a raw JSON record into field values.

        The base implementation is a plain passthrough of known fields, which
        is all Django models need. Document collections override it to resolve
        reference lookups and embedded documents.

        Args:
            d: Raw JSON record.
            model: Target model or embedded document class.

        Returns:
            Dereferenced field values.
        """
        fields = self.get_fields(model)
        r: dict[str, Any] = {}
        for k in d:
            v = d[k]
            if k.startswith("$"):
                continue  # Ignore $name
            if k == "uuid":
                r["uuid"] = UUID(v)
                continue
            if k not in fields:
                continue  # Ignore unknown fields
            r[k] = v
        return r

    def lookup(self, ref: type[Document], field: str, key: str) -> Document:
        v = self.ref_cache.get(RefKey(ref, field, key))
        if v:
            return v
        # .objects manager is added dynamically by metaclasses, not visible in stubs
        v = cast(Any, ref).objects.filter(**{field: key}).first()
        if v:
            self.ref_cache[RefKey(ref, field, key)] = v
            return v
        coll = ref._meta["collection"]
        raise ValueError(f"lookup for {coll}.{field} == '{key}' has been failed")

    # ------------------------------------------------------------------
    # Model handling, to be specialised by subclasses
    # ------------------------------------------------------------------

    @property
    def objects(self) -> Any:
        # Model manager, added dynamically by model metaclasses, not visible in stubs
        return cast(Any, self.model).objects

    def is_clean(self) -> bool:
        """
        Check if the collection has no records in the database.

        Returns:
            True if the collection is empty, False otherwise.
        """
        return not bool(self.objects.all()[:1])

    def find_by_unique_fields(self, d: dict[str, Any]) -> DB_MODEL_INSTANCE | None:
        """
        Find an existing record by its unique fields, ignoring the UUID.

        Used by the unique-constraint repair path in update_item(). A record
        created manually or by a legacy migration may carry a different UUID
        than the collection item, so the UUID lookup misses and the record
        must be found by its unique key instead.

        Args:
            d: Dereferenced collection item data.

        Returns:
            The existing record, or None if no constraint matches.
        """
        for f in self.get_unique_fields():
            fields = (f,) if isinstance(f, str) else f
            q = {fk: d[fk] for fk in fields if fk != "uuid" and fk in d}
            if not q:
                continue
            if o := self.objects.filter(**q).first():
                return o
        return None

    def before_sync(self) -> None:
        """
        Run pre-sync maintenance steps for the collection.
        """

    # ------------------------------------------------------------------
    # Sync
    # ------------------------------------------------------------------

    def update_item(self, data: dict[str, Any], _force_lookup: bool = False) -> bool:
        def set_attrs(obj: DB_MODEL_INSTANCE, values: dict[str, Any]) -> None:
            for vk, vv in values.items():
                if hasattr(obj, vk):
                    setattr(obj, vk, vv)

        if data["uuid"] in self.partial_errors:
            del self.partial_errors[data["uuid"]]
        try:
            d = self.dereference(data)
        except ValueError as e:
            self.partial_errors[data["uuid"]] = str(e)
            return False  # Partials
        # On a clean install this uuid cannot exist yet (uuid uniqueness in
        # collections is verified by tests), so skip the lookup and update
        # attempt. Re-entrant calls must always check: the record may have
        # been created by a previous pass.
        if (not self._is_clean or _force_lookup) and (
            o := self.objects.filter(uuid=data["uuid"]).first()
        ):
            self.stdout.write(
                "[{}|{}] Updating {}\n".format(self.name, data["uuid"], getattr(o, self.name_field))
            )
            set_attrs(o, d)
            o.save()
            return True
        self.stdout.write(
            "[{}|{}] Creating {}\n".format(self.name, data["uuid"], data.get(self.name_field))
        )
        o = self.model()
        set_attrs(o, d)
        try:
            o.save()
            return True
        except NotUniqueError, IntegrityError:
            # A record with the same unique key already exists, but its UUID
            # differs from the collection's one. This happens when a record
            # is created manually or by a legacy migration before the
            # collection adopts it. This repair is required: adopt the
            # existing record by pointing its UUID to the collection's one,
            # then re-run the update path. The recursive call must bypass
            # the clean-install fast path, otherwise the UUID lookup is
            # skipped, the item is created again, and the repair loops
            # forever. Duplicate unique keys within the collection itself
            # are impossible, as they are rejected by tests/collections.
            o = self.find_by_unique_fields(d)
            if o is None:
                self.stdout.write(
                    "[{}|{}] Unique constraint violation, aborting\n".format(
                        self.name, data["uuid"]
                    )
                )
                raise
            self.stdout.write(
                "[{}|{}] Reusing local object {}\n".format(
                    self.name, data["uuid"], getattr(o, self.name_field)
                )
            )
            o.uuid = data["uuid"]
            o.save()
            return self.update_item(data, _force_lookup=True)

    def delete_item(self, uuid: str) -> None:
        o = self.objects.filter(uuid=uuid).first()
        if not o:
            return
        self.stdout.write(f"[{self.name}|{uuid}] Deleting {getattr(o, self.name_field)}\n")
        o.delete()

    def sync(self) -> None:
        # Read collection from JSON files
        cdata = self.get_items()
        if not cdata:
            self.stdout.write(f"[{self.name}] Ignoring empty collection\n")
            return
        self.stdout.write(f"[{self.name}] Synchronizing\n")
        self.before_sync()
        # Get previous state
        cs = self.get_state()
        current_uuids = set(cs)
        new_uuids = set(cdata)
        changed = False
        for u in new_uuids - current_uuids:
            self.update_item(cdata[u].data)
            changed = True
        # Changed items
        for u in new_uuids & current_uuids:
            if cs[u] != cdata[u].hash:
                self.update_item(cdata[u].data)
                changed = True
        # Resolve partials
        while self.partial_errors:
            pl = len(self.partial_errors)
            for u in list(self.partial_errors):  # may change size
                # Partials may already have been created (embedded references
                # are resolved lazily), so force the UUID lookup
                self.update_item(cdata[u].data, _force_lookup=True)
            if len(self.partial_errors) == pl:
                # Cannot resolve partials
                for u in self.partial_errors:
                    self.stdout.write(f"[{self.name}|{u}] Error: {self.partial_errors[u]}\n")
                raise ValueError(
                    f"[{self.name}] Cannot resolve references for {', '.join(self.partial_errors)}"
                )
        # Deleted items
        for u in current_uuids - new_uuids:
            try:
                self.delete_item(u)
            except ValueError as e:
                self.partial_errors[u] = str(e)
            changed = True
        # Save state
        if changed:
            state = {u: cdata[u].hash for u in sorted(cdata)}
            self.save_state(state)

    # ------------------------------------------------------------------
    # Install / bulk sync
    # ------------------------------------------------------------------

    @classmethod
    def install(cls, data: dict[str, Any]) -> None:
        """Write data to the proper collection JSON path."""
        c = cls.get_by_name(data["$collection"])
        data = c.dereference(data)
        o = cast(Any, c.model(**data))
        # Format JSON
        json_data = o.to_json()
        # Write
        path = Path(cls.PREFIX, c.name) / o.get_json_path()
        if "uuid" not in data:
            raise ValueError("Invalid JSON: No UUID")
        c.stdout.write("[{}|{}] Installing {}\n".format(c.name, data["uuid"], path))
        safe_rewrite(path, json_data, mode=0o644)

    @classmethod
    def sync_all(cls) -> None:
        """Synchronize all collections."""
        for c in cls.iter_collections():
            c.sync()


class ModelCollection(BaseCollection[type[NOCModel]]):
    """
    Collection for Django models.
    """

    @classmethod
    def get_collection_name(cls, model: type[NOCModel]) -> str:
        return model._json_collection["json_collection"]

    def get_fields(self, model: DB_MODEL_TYPE | None = None) -> dict[str, Any]:
        m = cast("type[NOCModel]", model or self.model)
        return {field.name: field.__class__ for field in m._meta.local_fields}

    def get_unique_fields(self) -> list[str | tuple[str, ...]]:
        return self.model._json_collection.get("json_unique_fields", [])


class DocumentCollection(BaseCollection[type[Document]]):
    """
    Collection for mongoengine documents.
    """

    @classmethod
    def get_collection_name(cls, model: type[Document]) -> str:
        # _meta is a plain dict at runtime, TypedDict in stubs
        return getattr(model, "_meta")["json_collection"]

    def __init__(self, model: type[Document], stdout: TextIO | None = None) -> None:
        super().__init__(model, stdout)
        # json_api_version is declared as int, model meta may hold str
        self._api_version = cast(
            "int | str", model._meta.get("json_api_version", self.DEFAULT_API_VERSION)
        )

    def get_fields(self, model: DB_MODEL_TYPE | None = None) -> dict[str, Any]:
        m = model or self.model
        return m._fields

    def get_unique_fields(self) -> list[str | tuple[str, ...]]:
        # _meta is a plain dict at runtime, TypedDict in stubs
        return getattr(self.model, "_meta").get("json_unique_fields", [])

    def _find_name_field(self) -> str | None:
        if nf := super()._find_name_field():
            return nf
        # index_specs is declared per document, not visible on the base stubs
        for spec in getattr(self.model, "_meta")["index_specs"]:
            if spec.get("unique") and len(spec["fields"]) == 1:
                return spec["fields"][0][0]
        return None

    def before_sync(self) -> None:
        # On a clean install there are no string UUIDs to fix
        if not self._is_clean:
            self.fix_uuids()

    def dereference(self, d: dict[str, Any], model: DB_MODEL_TYPE | None = None) -> dict[str, Any]:
        fields = self.get_fields(model)
        r: dict[str, Any] = {}
        for k in d:
            v = d[k]
            if k.startswith("$"):
                continue  # Ignore $name
            if k == "uuid":
                r["uuid"] = UUID(v)
                continue
            # Dereference ref__name lookups
            if "__" in k:
                # Lookup
                k, f = k.split("__")
                if k not in fields:
                    raise ValueError(f"Invalid lookup field: {k}")
                ref = fields[k].document_type
                v = self.lookup(ref, f, v)
            # Get field
            try:
                field = fields[k]
            except KeyError:
                continue  # Ignore unknown fields
            # .field and .document_type are not exposed by mongoengine stubs
            mf: Any = field
            # Dereference ListFields
            if (
                isinstance(field, ListField) and isinstance(mf.field, EmbeddedDocumentField)
            ) or isinstance(field, EmbeddedDocumentListField):
                edoc = mf.field.document_type
                try:
                    v = [edoc(**self.dereference(x, model=edoc)) for x in d[k]]
                except ValueError as e:
                    v = []
                    self.partial_errors[d["uuid"]] = str(e)
            elif isinstance(field, EmbeddedDocumentField):
                try:
                    v = mf.document_type(**self.dereference(v, model=mf.document_type))
                except ValueError as e:
                    v = None
                    self.partial_errors[d["uuid"]] = str(e)
            elif isinstance(field, ListField) and isinstance(mf.field, ReferenceField):
                edoc = cast(Any, mf.field).document_type
                try:
                    v = [self.lookup(edoc, "name", x) for x in d[k]]
                except ValueError as e:
                    self.partial_errors[d["uuid"]] = str(e)
                    raise ValueError(f"Invalid lookup field: {k}")
            # Dereference binary field
            if isinstance(field, BinaryField):
                v = b85decode(v)
            r[k] = v
        return r

    def fix_uuids(self) -> None:
        """Convert string UUIDs to binary in the underlying collection."""
        coll = self.model._get_collection()
        bulk = [
            UpdateOne({"_id": d["_id"]}, {"$set": {"uuid": UUID(d["uuid"])}})
            for d in coll.find({"uuid": {"$type": "string"}}, {"_id": 1, "uuid": 1})
        ]
        if bulk:
            self.stdout.write(f"[{self.name}] Fixing {len(bulk)} UUID\n")
            coll.bulk_write(bulk)


# Backward-compatibility alias
Collection = BaseCollection
