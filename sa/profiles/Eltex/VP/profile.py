# ---------------------------------------------------------------------
# Vendor: Eltex
# OS:     VP (IP-phones)
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.profile.base import BaseProfile


class Profile(BaseProfile):
    name = "Eltex.VP"

    pattern_prompt = rb"([\w-]+@[\w-]+:[\w\-~]+|)# "
    command_exit = "exit"
