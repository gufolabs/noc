# ---------------------------------------------------------------------
# Eltex.VP.get_version
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.script.base import BaseScript
from noc.sa.interfaces.igetversion import IGetVersion


class Script(BaseScript):
    name = "Eltex.VP.get_version"
    cache = True
    interface = IGetVersion

    def execute_cli(self):
        version = self.cli("cat /etc/version")
        if version:
            version = version.replace("\n", "")
        return {"vendor": "Eltex", "platform": "VP", "version": version}
