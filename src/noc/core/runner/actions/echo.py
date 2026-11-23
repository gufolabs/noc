# ---------------------------------------------------------------------
# echo action
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

from .base import BaseAction


class EchoAction(BaseAction):
    """
    Pass input to output.
    """

    name = "echo"

    async def execute(self, *, x: str, **kwargs: str) -> str:
        return x
