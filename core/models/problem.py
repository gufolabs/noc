# ----------------------------------------------------------------------
# Job Problem DataClass
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from dataclasses import dataclass, field

# Third-party modules
from typing import List, Dict, Optional, Any


@dataclass(frozen=True)
class ProblemItem:
    alarm_class: Optional[str]
    message: str = ""
    path: list[str] = field(default_factory=list)
    labels: list[str] = field(default_factory=list)
    fatal: bool = False
    diagnostic: Optional[str] = None
    vars: dict[str, Any] = field(default_factory=dict)
    code: Optional[str] = None
    check: Optional[str] = None
