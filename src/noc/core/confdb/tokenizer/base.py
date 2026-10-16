# ----------------------------------------------------------------------
# BaseTokenizer
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections.abc import Iterator


class BaseTokenizer:
    name = None

    def __init__(self, data: str) -> None:
        self.data = data

    def __iter__(self) -> Iterator[tuple[str]]:
        return iter(())
