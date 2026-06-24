# ----------------------------------------------------------------------
# alarm datastream model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime
from typing import Optional, List, Dict, Union

# Third-party modules
from pydantic import BaseModel

# NOC modules
from .utils import RemoteSystemItem


class ManagedObjectProfileItem(BaseModel):
    id: str
    name: str


class ManagedObjectItem(BaseModel):
    id: str
    name: str
    object_profile: ManagedObjectProfileItem
    remote_system: Optional[RemoteSystemItem]
    remote_id: Optional[str]


class AlarmClassItem(BaseModel):
    id: str
    name: str


class EscalationItem(BaseModel):
    timestamp: datetime.datetime
    tt_id: str
    tt_system: str
    error: Optional[str]
    close_timestamp: Optional[datetime.datetime]
    close_error: Optional[str]


class ServiceProfileItem(BaseModel):
    id: str
    name: str


class ServiceSummaryItem(BaseModel):
    profile: ServiceProfileItem
    summary: int


class SubscriberProfileItem(BaseModel):
    id: str
    name: str


class SubscriberSummaryItem(BaseModel):
    profile: SubscriberProfileItem
    summary: int


class AlarmDataStreamItem(BaseModel):
    id: str
    change_id: str
    timestamp: datetime.datetime
    severity: int
    reopens: int
    labels: Optional[list[str]]
    tags: Optional[list[str]]
    root: Optional[str]
    clear_timestamp: Optional[str]
    managed_object: ManagedObjectItem
    alarm_class: AlarmClassItem
    vars: dict[str, Union[str, int]]
    escalation: Optional[EscalationItem]
    direct_services: list[ServiceSummaryItem]
    total_services: list[ServiceSummaryItem]
    direct_subscribers: list[SubscriberSummaryItem]
    total_subscribers: list[SubscriberSummaryItem]
