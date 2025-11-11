# ----------------------------------------------------------------------
# GetStyle protocol
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 Gufo Labs
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Protocol, Optional, runtime_checkable


@runtime_checkable
class GetStyle(Protocol):
    """
    Get styling info.

    - get_style() - Get item style
    """

    def get_style(self) -> Optional[str]: ...
