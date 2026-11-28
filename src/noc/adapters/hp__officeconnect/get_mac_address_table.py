# ---------------------------------------------------------------------
# HP.OfficeConnect.get_mac_address_table
# ---------------------------------------------------------------------
# Copyright (C) 2007-2024 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_mac_address_table import Script as BaseScript
from noc.sa.interfaces.igetmacaddresstable import IGetMACAddressTable


class Script(BaseScript):
    name = "HP.OfficeConnect.get_mac_address_table"
    interface = IGetMACAddressTable
