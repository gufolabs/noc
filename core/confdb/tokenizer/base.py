# ----------------------------------------------------------------------
# BaseTokenizer
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Iterator, Tuple


class BaseTokenizer:
    name = None

    def __init__(self, data: str):
        self.data = data

    def __iter__(self) -> Iterator[tuple[str]]:
        return iter(())
