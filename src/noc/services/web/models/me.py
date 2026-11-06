# ----------------------------------------------------------------------
# MeRequest and MeResponse
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules

# Third-party modules
from pydantic import BaseModel, Field


class MeRequest(BaseModel): ...


class GroupItem(BaseModel):
    id: str
    name: str


class MeResponse(BaseModel):
    """
    Attributes:
        avatar_label: Letters to be used when avatar is missed or empty
        avatar_label_fg: CSS background to be used along with avatar_label
        avatar_label_bg: CSS background to be used along with avatar_label
    """

    id: str
    username: str
    language: str
    groups: list[GroupItem]
    avatar_label: str = Field(title="Avatar Label")
    avatar_label_fg: str = Field(title="Avatar Label Foreground")
    avatar_label_bg: str = Field(title="Avatar Label Background")
    avatar_url: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
