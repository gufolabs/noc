# ----------------------------------------------------------------------
# DefaultPlatformItem
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import datetime as dt

# Third-party modules
from pydantic import BaseModel

from .label import LabelItem
from .utils import Reference


class DefaultPlatformItem(BaseModel):
    id: str
    name: str
    vendor: Reference
    labels: list[LabelItem]
    effective_labels: list[LabelItem]
    full_name: str | None = None
    description: str | None = None
    start_of_sale: dt.datetime | None = None
    end_of_sale: dt.datetime | None = None
    end_of_support: dt.datetime | None = None
    end_of_xsupport: dt.datetime | None = None
    snmp_sysobjectid: str | None = None
    aliases: list[str] | None = None
    uuid: str | None = None
    bi_id: str | None = None


class FormPlatformItem(BaseModel):
    name: str
    vendor: Reference
    description: str | None = None
    start_of_sale: dt.datetime | None = None
    end_of_sale: dt.datetime | None = None
    end_of_support: dt.datetime | None = None
    end_of_xsupport: dt.datetime | None = None
    snmp_sysobjectid: str | None = None
    labels: list[str] | None = None
