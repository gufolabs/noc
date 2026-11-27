# ---------------------------------------------------------------------
# Meinberg.LANTIME.get_capabilities
# ---------------------------------------------------------------------
# Copyright (C) 2007-2022 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_capabilities import Script as BaseScript


class Script(BaseScript):
    name = "Meinberg.LANTIME.get_capabilities"
