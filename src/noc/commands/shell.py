# ----------------------------------------------------------------------
# Python shell command
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import os
import subprocess

# NOC modules
from noc.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Run the NOC Python shell"

    def handle(self, *args, **options) -> int:
        executable = "./bin/ipython" if os.access("./bin/ipython", os.X_OK) else "./bin/python"
        return subprocess.call([executable])
