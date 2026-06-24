# ----------------------------------------------------------------------
# cfgeventrules datastream model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Optional, List, Literal

# Third-party modules
from pydantic import BaseModel, Field

# NOC modules
from noc.core.fm.enum import EventSource


class ClassificationPattern(BaseModel):
    key_re: str
    value_re: str


class RuleVar(BaseModel):
    name: str
    value: str


class EventClass(BaseModel):
    id: str
    name: str


class ClassificationRule(BaseModel):
    id: str
    name: str
    rule: Literal["classification", "ignore_pattern"] = Field(None, alias="$type")
    event_class: Optional[EventClass] = None
    source: Optional[list[EventSource]] = None
    profiles: Optional[list[str]] = None
    preference: int = 1000
    message_rx: Optional[str] = None
    patterns: Optional[list[ClassificationPattern]] = None
    vars: Optional[list[RuleVar]] = None
    labels: Optional[list[str]]
    to_dispose: bool = False
