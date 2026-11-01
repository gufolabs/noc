# ----------------------------------------------------------------------
# Test .to_json() method
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from pathlib import Path
from uuid import UUID

# NOC modules
from noc.core.protocols.to_json import ToJson
from noc.models import DB_MODEL_TYPE

from ..utils import check_protocol


def test_to_json_protocol(json_documents: DB_MODEL_TYPE) -> None:
    check_protocol(ToJson, json_documents)


def test_get_json_path(json_documents: DB_MODEL_TYPE) -> None:
    seen: dict[Path, UUID] = {}
    for o in json_documents.objects.all():
        path = o.get_json_path()
        assert path
        assert isinstance(path, Path)
        assert path.suffix == ".json"
        taken_by = seen.get(path)
        if taken_by:
            print(f">>> UUID: {o.uuid} -- {o}")
            t_o = json_documents.objects.get(uuid=taken_by)
            print(f"   taken by {t_o.uuid} -- {t_o}")
        assert taken_by is None, f"{path} requested by {o.uuid} but already taken by {taken_by}"
        seen[path] = o.uuid


def test_to_json(json_documents: DB_MODEL_TYPE) -> None:
    for o in json_documents.objects.all():
        j = o.to_json()
        assert j
        assert isinstance(j, str)
