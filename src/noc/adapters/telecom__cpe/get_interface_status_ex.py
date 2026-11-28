# ---------------------------------------------------------------------
# Telecom.CPE.get_interface_status_ex
# ---------------------------------------------------------------------
# Copyright (C) 2023-2024 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_interface_status_ex import Script as BaseScript
from noc.sa.interfaces.igetinterfacestatusex import IGetInterfaceStatusEx


class Script(BaseScript):
    name = "Telecom.CPE.get_interface_status_ex"
    interface = IGetInterfaceStatusEx
