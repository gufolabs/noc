# ----------------------------------------------------------------------
# Pretty command
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import asyncio
import os

# NOC modules
from noc.core.dcs.base import dcs
from noc.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Create slots.
    """

    help = "migrate slots"

    def handle(self, *args, **options):
        async def inner() -> bool:
            changed = False
            for k, v in sorted(slots.items()):
                current = await dcs.get_slot_limit(k)
                if current is None or current != v:
                    if current:
                        self.print(f"Chaning {k}: {current}->{v}")
                    else:
                        self.print(f"Setting {k} to {v}")
                    await dcs.set_slot_limit(k, v)
                    changed = True
            return changed

        slots: dict[str, int] = {}
        for name, value in os.environ.items():
            if not name.startswith("NOC_MIGRATE_SLOTS_"):
                continue
            svc = name[18:]
            if "_" in svc:
                x, y = svc.split("_", 1)
                svc = f"{x}-{y}"
            slots[svc] = int(value)
        # Apply
        changed = asyncio.run(inner())
        self.print("CHANGED" if changed else "OK")
