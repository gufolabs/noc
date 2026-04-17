# ---------------------------------------------------------------------
# Eltex.SMG.get_inventory
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_inventory import Script as BaseScript


class Script(BaseScript):
    name = "Eltex.SMG.get_inventory"
    cache = True
