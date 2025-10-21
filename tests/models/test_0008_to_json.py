# ----------------------------------------------------------------------
# Test .to_json() method
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Set
from pathlib import Path

# Third-party modules
import pytest

# NOC modules
from noc.core.protocols.to_json import ToJson
from .util import get_documents
from ..utils import check_protocol

SELECTED_MODELS = [
    x for x in get_documents() if hasattr(x, "get_json_path") or hasattr(x, "to_json")
]


@pytest.mark.parametrize("model", SELECTED_MODELS)
def test_to_json_protocol(model) -> None:
    check_protocol(ToJson, model)


@pytest.mark.parametrize("model", SELECTED_MODELS)
def test_get_json_path(model) -> None:
    seen: Set[Path] = set()
    for o in model.objects.all():
        path = o.get_json_path()
        assert path
        assert isinstance(path, Path)
        assert path.suffix == ".json"
        assert path not in seen
        seen.add(path)


@pytest.mark.parametrize("model", SELECTED_MODELS)
def test_to_json(model):
    for o in model.objects.all():
        j = o.to_json()
        assert j
        assert isinstance(j, str)
