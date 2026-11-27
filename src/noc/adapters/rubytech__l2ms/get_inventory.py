# ---------------------------------------------------------------------
# Rubytech.l2ms.get_inventory
# ---------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_inventory import Script as BaseScript
from noc.sa.interfaces.igetinventory import IGetInventory


class Script(BaseScript):
    name = "Rubytech.l2ms.get_inventory"
    interface = IGetInventory
