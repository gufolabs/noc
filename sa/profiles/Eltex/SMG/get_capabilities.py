# ---------------------------------------------------------------------
# Eltex.SMG.get_capabilities
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_capabilities import Script as BaseScript


class Script(BaseScript):
    name = "Eltex.SMG.get_capabilities"
    cache = True
