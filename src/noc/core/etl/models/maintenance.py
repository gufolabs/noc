# ----------------------------------------------------------------------
# MaintenanceModel
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime as dt
from typing import Literal

# Third-party modules
from pydantic import BaseModel as _BaseModel

from .base import BaseModel


class MaintenanceObject(_BaseModel):
    type: Literal["managed_object"]
    remote_id: str
    name: str | None = None
    # As Resource ?


class MaintenanceService(_BaseModel):
    type: Literal["service"]
    remote_id: str
    name: str | None = None


class Maintenance(BaseModel):
    id: str
    subject: str
    type: str
    start: dt.datetime
    stop: dt.datetime
    contacts: str
    is_completed: bool = False
    objects: list[MaintenanceObject | MaintenanceService]
    description: str | None = None
    # Deadline
    suppress_alarms: bool = True
