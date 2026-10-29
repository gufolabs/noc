# ----------------------------------------------------------------------
# MongoDB shell command
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
    help = "Run the MongoDB shell"

    def handle(self, *args, **options) -> int:
        shell_file = f"{os.environ.get('MONGO_DIR', '')}/shell.js"
        return subprocess.call(["mongo", "--shell", shell_file])
