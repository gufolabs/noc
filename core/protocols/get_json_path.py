# ----------------------------------------------------------------------
# GetJsonPath protocol
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 Gufo Labs
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from pathlib import Path
from typing import Protocol, runtime_checkable


@runtime_checkable
class GetJsonPath(Protocol):
    """
    Relative JSON path in the collection.

    Models must implement GetJsonPath protocol in order
    to save and load data from collections.
    """

    def get_json_path(self) -> Path: ...
