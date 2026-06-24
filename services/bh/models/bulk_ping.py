# ---------------------------------------------------------------------
# Ping models
# ---------------------------------------------------------------------
# Copyright (C) 2007-2023 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
from typing import Optional, List

# Third-party modules
from pydantic import BaseModel


class PingRequest(BaseModel):
    addresses: list[str]
    timeout: Optional[int]
    n: int = 1
    tos: Optional[int]


class PingItem(BaseModel):
    address: str
    rtt: list[Optional[float]]


class PingResponse(BaseModel):
    items: list[PingItem]
