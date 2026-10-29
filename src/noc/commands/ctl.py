# ----------------------------------------------------------------------
# supervisorctl command
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import argparse
import subprocess

# NOC modules
from noc.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Run supervisorctl"

    def add_arguments(self, parser: argparse.ArgumentParser) -> None:
        parser.add_argument(
            "args", nargs=argparse.REMAINDER, help="Arguments passed to supervisorctl"
        )

    def handle(self, args: list[str], **options) -> int:
        return subprocess.call(["./bin/supervisorctl", *args])
