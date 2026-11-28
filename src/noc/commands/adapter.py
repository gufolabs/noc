# ----------------------------------------------------------------------
# adapter command
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import argparse

# NOC modules
from noc.core.management.base import BaseCommand
from noc.core.profile.names import mangle_profile_name


class Command(BaseCommand):
    help = "Device adapter utilities"

    def add_arguments(self, parser: argparse.ArgumentParser) -> None:
        subparsers = parser.add_subparsers(dest="cmd", required=True)
        mangle_parser = subparsers.add_parser(
            "mangle",
            help="Print the flat adapter directory name for a profile name",
            description=(
                "Map a profile name (e.g. 'Cisco.IOS') to the flat adapter "
                "directory name (e.g. 'cisco__ios') used under adapters/."
            ),
        )
        mangle_parser.add_argument("name", help="Profile name, e.g. Cisco.IOS")

    def handle(self, *args, **options):
        return getattr(self, f"handle_{options['cmd']}")(*args, **options)

    def handle_mangle(self, *args, **options) -> None:
        name = options["name"]
        self.print(mangle_profile_name(name))
