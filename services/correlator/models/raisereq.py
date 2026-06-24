# ---------------------------------------------------------------------
# Raise Request
# ---------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
from typing import Optional, Dict, Any, List, Literal

# Third-party modules
from pydantic import BaseModel, Field


class GroupItem(BaseModel):
    reference: str
    alarm_class: Optional[str] = None
    name: Optional[str] = None


class RaiseRequest(BaseModel):
    op: Literal["raise"] = Field(None, alias="$op")
    reference: str
    managed_object: str
    alarm_class: str
    severity: Optional[int] = None
    timestamp: Optional[str] = None
    groups: Optional[list[GroupItem]] = None
    vars: Optional[dict[str, Any]] = None
    labels: Optional[list[str]] = None
    remote_system: Optional[str] = None
    remote_id: Optional[str] = None
