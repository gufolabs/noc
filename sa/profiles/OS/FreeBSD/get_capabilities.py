# ---------------------------------------------------------------------
# OS.FreeBSD.get_capabilities
# ---------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_capabilities import Script as BaseScript
from noc.sa.profiles.Generic.get_capabilities import false_on_cli_error


class Script(BaseScript):
    name = "OS.FreeBSD.get_capabilities"

    @false_on_cli_error
    def has_lldp_cli(self):
        """
        Check box has ladvd daemon enabled
        """
        r1 = self.cli("/usr/bin/pgrep ladvd")
        r2 = self.cli("/usr/bin/pgrep lldpd")
        return bool(r1 or r2)
