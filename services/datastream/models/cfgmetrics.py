# ----------------------------------------------------------------------
# cfgmetric datastream model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Optional, List, Any, Dict

# Third-party modules
from pydantic import BaseModel


class CollectorMapRule(BaseModel):
    collector: str
    field: str
    sender: str = Any
    allow_partial_match: bool = False
    aliases: Optional[list[str]] = None
    labels: Optional[list[str]] = None
    unit: Optional[str] = None
    preference: int = 0


class ScopeInfo(BaseModel):
    scope: str
    key_fields: list[str]
    key_labels: list[str]
    required_labels: list[str]
    units: dict[str, str]
    enable_timedelta: bool = False


class CfgMetric(BaseModel):
    id: str
    table: str
    field: str
    scope: ScopeInfo
    rules: Optional[list[CollectorMapRule]] = None
