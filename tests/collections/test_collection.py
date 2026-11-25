# ----------------------------------------------------------------------
# Test collections
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections.abc import Iterable
from pathlib import Path
from typing import Any

# Third-party modules
import orjson
import pytest

# NOC modules
from noc.models import COLLECTIONS, DB_MODEL_TYPE, get_model, is_document

ROOT = Path("collections")


def iter_path() -> Iterable[Path]:
    exclude = {ROOT / "package.json"}
    for fn in ROOT.rglob("*.json"):
        if fn not in exclude:
            yield fn


def iter_collections() -> Iterable[str]:
    """Return collection names as directories in collections/."""
    for d in sorted(ROOT.iterdir()):
        if d.is_dir():
            yield d.name


def iter_items(path: Path) -> Iterable[dict[str, Any]]:
    """
    Iterate all items of a collection JSON file.

    The file may contain a single record (dict), a plain list of
    records, or a bundle (dict with $type == "bundle" and "items").

    Args:
        path: Path to the JSON file.

    Yields:
        Item dicts.
    """
    with open(path) as fp:
        data = orjson.loads(fp.read())
    if isinstance(data, list):
        yield from data
    elif isinstance(data, dict) and data.get("$type") == "bundle":
        yield from data.get("items", [])
    else:
        yield data


@pytest.mark.parametrize("path", list(iter_path()), ids=str)
def test_json(path: Path) -> None:
    with open(path) as fp:
        data = orjson.loads(fp.read())
    # @todo: Replace with assert
    if "$collection" not in data:
        # pytest.xfail("$collection is missed")
        return
    assert path.parts[1] == data["$collection"]
    for item in iter_items(path):
        assert "uuid" in item, f"No uuid in item: {path}"


@pytest.mark.parametrize("name", list(iter_collections()), ids=str)
def test_uuid_unique(name: str) -> None:
    seen: dict[str, Path] = {}
    for path in sorted((ROOT / name).rglob("*.json")):
        for item in iter_items(path):
            uuid = item.get("uuid")
            assert uuid, f"No uuid in item: {path}"
            prev = seen.get(uuid)
            assert prev is None, f"UUID {uuid} collision: {prev} and {path}"
            seen[uuid] = path


def _collection_name(model: DB_MODEL_TYPE) -> str:
    """Return json collection name for the model class."""
    if hasattr(model, "_json_collection"):
        return model._json_collection["json_collection"]
    return getattr(model, "_meta")["json_collection"]


MODELS_BY_COLLECTION: dict[str, DB_MODEL_TYPE] = {
    _collection_name(m): m for c in COLLECTIONS if (m := get_model(c))
}


def _unique_constraints(model: DB_MODEL_TYPE) -> list[tuple[str, ...]]:
    """
    Return unique constraints of the model as field name tuples.

    Includes json_unique_fields and individually unique fields.
    """
    if is_document(model):
        meta: Any = model._meta
        fields: Any = model._fields
        keys: list[str | tuple[str, ...]] = list(meta.get("json_unique_fields") or [])
        keys.extend(n for n, f in fields.items() if getattr(f, "unique", False))
    else:
        jc: Any = model._json_collection
        keys = list(jc.get("json_unique_fields", []))
        keys.extend(f.name for f in model._meta.local_fields if f.unique)
    # Deduplicate (json_unique_fields and unique=True may overlap)
    return list(dict.fromkeys(k if isinstance(k, tuple) else (k,) for k in keys))


def _item_value(item: dict[str, Any], field: str) -> Any:
    """Return model field value from a JSON item, including ref__lookup forms."""
    if field in item:
        return item[field]
    for k, v in item.items():
        if k.startswith(field + "__"):
            return v
    return None


def _norm(v: Any) -> Any:
    """Make a value hashable for collision detection."""
    if isinstance(v, list):
        return tuple(sorted(str(x) for x in v))
    if isinstance(v, dict):
        return repr(v)
    return v


@pytest.mark.parametrize("name", list(iter_collections()), ids=str)
def test_unique_fields(name: str) -> None:
    model = MODELS_BY_COLLECTION.get(name)
    if model is None:
        pytest.skip(f"No model for collection {name}")
    constraints = _unique_constraints(model)
    if not constraints:
        pytest.skip("No unique constraints")
    seen: dict[tuple[Any, ...], tuple[str, Path]] = {}
    for path in sorted((ROOT / name).rglob("*.json")):
        for item in iter_items(path):
            for fields in constraints:
                value = tuple(_norm(_item_value(item, f)) for f in fields)
                if any(v is None for v in value):
                    continue
                label = " ".join(f"{f}={v!r}" for f, v in zip(fields, value))
                prev = seen.get((fields, value))
                assert prev is None, f"Duplicate unique {label}: {prev[0]} and {path}"
                seen[(fields, value)] = (label, path)
