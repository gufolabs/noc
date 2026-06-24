# ----------------------------------------------------------------------
# Zk models
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules

# Third-party modules
from pydantic import BaseModel, Field


class ZkConfigConfigZeroconf(BaseModel):
    id: int | None
    key: str | None
    interval: int


class ZkConfigMetrics(BaseModel):
    type: str
    url: str


class ZkConfigConfig(BaseModel):
    zeroconf: ZkConfigConfigZeroconf
    metrics: ZkConfigMetrics | None


class ZkConfigCollector(BaseModel, extra="allow"):
    id: str
    type: str
    service: int
    interval: int
    labels: list[str]


class ZkConfig(BaseModel):
    version: str = Field("1", alias="$version")
    type: str = Field("zeroconf", alias="$type")
    config: ZkConfigConfig
    collectors: list[ZkConfigCollector]
