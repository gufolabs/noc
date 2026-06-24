# ----------------------------------------------------------------------
# DefaultObjectItem
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Optional, List

# Third-party modules
from pydantic import BaseModel

# NOC modules
from .utils import Reference
from ..models.label import LabelItem


class PointItem(BaseModel):
    x: float
    y: float


class DefaultObjectItem(BaseModel):
    id: str
    name: str
    model: Reference
    bi_id: str
    labels: list[LabelItem]
    effective_labels: list[LabelItem]
    container: Optional[Reference] = None
    layer: Optional[Reference] = None
    point: Optional[PointItem] = None
    remote_system: Optional[Reference] = None
    remote_id: Optional[str] = None


class FormObjectItem(BaseModel):
    name: str
    model: Reference
    labels: list[LabelItem]
    container: Optional[Reference] = None
