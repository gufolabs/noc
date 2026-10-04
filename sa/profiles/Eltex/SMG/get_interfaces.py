# ---------------------------------------------------------------------
# Eltex.SMG.get_interfaces
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_interfaces import Script as BaseScript


class Script(BaseScript):
    name = "Eltex.SMG.get_interfaces"
    cache = True
