# ---------------------------------------------------------------------
# Beward.Doorphone.get_chassis_id
# ---------------------------------------------------------------------
# Copyright (C) 2007-2022 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------


# NOC modules
from noc.adapters.generic__host.get_chassis_id import Script as BaseScript
from noc.sa.interfaces.igetchassisid import IGetChassisID


class Script(BaseScript):
    name = "Beward.Doorphone.get_chassis_id"
    interface = IGetChassisID
    cache = True
