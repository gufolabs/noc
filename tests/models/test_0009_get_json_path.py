# ----------------------------------------------------------------------
# Test .get_json_path() method
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import runtime_checkable, Set, Protocol
from pathlib import Path

# Third-party modules
import pytest

# NOC modules
from noc.core.protocols.get_json_path import GetJsonPath
from .util import get_documents


# Mark @runtime_checkable for isinstance() support
@runtime_checkable
class CheckGetJsonPath(GetJsonPath, Protocol): ...


SELECTED_MODELS = [x for x in get_documents() if hasattr(x, "get_json_path")]


@pytest.mark.parametrize("model", SELECTED_MODELS)
def test_get_json_path_protocol(model) -> None:
    assert isinstance(model, CheckGetJsonPath)


@pytest.mark.parametrize("model", SELECTED_MODELS)
def test_document_get_json_path(model) -> None:
    seen: Set[Path] = set()
    for o in model.objects.all():
        path = o.get_json_path()
        assert path
        assert isinstance(path, Path)
        assert path.suffix == ".json"
        assert path not in seen
        seen.add(path)
