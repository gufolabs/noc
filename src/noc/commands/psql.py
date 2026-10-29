# ----------------------------------------------------------------------
# PostgreSQL shell command
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import os
import subprocess

# NOC modules
from noc.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Run psql as the NOC user"

    def handle(self, *args, **options) -> int:
        user = os.environ.get("NOC_USER")
        if not user:
            raise CommandError("NOC_USER is not set")
        return subprocess.call(["su", "-", user, "-c", "psql"])
