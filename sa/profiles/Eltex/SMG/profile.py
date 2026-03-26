# ---------------------------------------------------------------------
# Vendor: Eltex
# OS:     SMG
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.profile.base import BaseProfile


class Profile(BaseProfile):
    name = "Eltex.SMG"

    # pattern_username = r"^\S+ login: "
    # pattern_prompt = r"^(?P<hostname>\S+)# "
    pattern_prompt = rb"(SMG2016> )|(SMG3016> )|(/[\w/]+ # )"
    command_exit = "exit"

    @classmethod
    def get_interface_type(cls, name):
        if name.startswith("front"):
            return "physical"
        if name.startswith(("host", "sm", "eth")):
            return "other"
        raise Exception("Cannot detect interface type for %s" % name)
