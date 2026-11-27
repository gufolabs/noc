# ---------------------------------------------------------------------
# Rotek.RTBSv1.get_fqdn
# ---------------------------------------------------------------------
# Copyright (C) 2007-2024 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_fqdn import Script as BaseScript
from noc.sa.interfaces.igetfqdn import IGetFQDN


class Script(BaseScript):
    name = "Rotek.RTBSv1.get_fqdn"
    interface = IGetFQDN
