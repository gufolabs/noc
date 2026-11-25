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
