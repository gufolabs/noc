# ----------------------------------------------------------------------
# Various HTML-generation utilities
# ----------------------------------------------------------------------
# Copyright (C) 2007-2021 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Protocol


class HasTags(Protocol):
    tags: str | list[str] | None


def tags_list(o: HasTags) -> str:
    if isinstance(o.tags, str):
        tags = [x for x in o.tags.split(",") if x]
    else:
        tags = o.tags or []
    s = ["<ul class='tags-list'>"] + [f"<li>{t}</li>" % t for t in tags] + ["</ul>"]
    return "".join(s)
