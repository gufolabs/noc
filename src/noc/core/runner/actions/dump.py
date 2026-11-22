# ---------------------------------------------------------------------
# Dump action
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

from .base import BaseAction


class DumpAction(BaseAction):
    """
    Dump environment.
    """

    name = "dump"

    async def execute(self, **kwargs: str) -> None:
        self.logger.info("Dumping environment")
        for k, v in sorted(self.env.items()):
            self.logger.info("%s = %s", k, v)
