# ---------------------------------------------------------------------
# Eltex.SMG.get_interface_status_ex
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_interface_status_ex import Script as BaseScript


class Script(BaseScript):
    name = "Eltex.SMG.get_interface_status_ex"
    cache = True
