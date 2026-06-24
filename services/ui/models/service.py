# ----------------------------------------------------------------------
# DefaultServiceItem
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime
from typing import Optional, List

# Third-party modules
from pydantic import BaseModel

# NOC modules
from .utils import Reference
from ..models.label import LabelItem


class DefaultServiceItem(BaseModel):
    id: str
    profile: Reference
    ts: datetime.datetime
    state: Reference
    state_changed: datetime.datetime
    labels: list[LabelItem]
    effective_labels: list[LabelItem]
    static_service_groups: list[Reference]
    effective_service_groups: list[Reference]
    static_client_groups: list[Reference]
    effective_client_groups: list[Reference]
    parent: Optional[Reference] = None
    subscriber: Optional[Reference] = None
    supplier: Optional[Reference] = None
    description: Optional[str] = None
    agreement_id: Optional[str] = None
    order_id: Optional[str] = None
    stage_id: Optional[str] = None
    stage_name: Optional[str] = None
    stage_start: Optional[datetime.datetime] = None
    account_id: Optional[str] = None
    address: Optional[str] = None
    managed_object: Optional[Reference] = None
    nri_port: Optional[str] = None
    remote_system: Optional[Reference] = None
    remote_id: Optional[str] = None
    bi_id: Optional[int] = None


class FormServiceItem(BaseModel):
    profile: Reference
    parent: Optional[Reference] = None
    subscriber: Optional[Reference] = None
    supplier: Optional[Reference] = None
    description: Optional[str] = None
    agreement_id: Optional[str] = None
    order_id: Optional[str] = None
    stage_id: Optional[str] = None
    stage_name: Optional[str] = None
    stage_start: Optional[str] = None
    account_id: Optional[str] = None
    address: Optional[str] = None
    managed_object: Optional[Reference] = None
    nri_port: Optional[str] = None
    labels: Optional[list[str]] = None
    static_service_groups: Optional[list[Reference]] = None
    static_client_groups: Optional[list[Reference]] = None


class PreviewServiceItem(BaseModel):
    id: str
    profile: Reference
    parent: Optional[Reference] = None
    state: Reference
    state_changed: Optional[datetime.datetime] = None
    description: str
    address: str
