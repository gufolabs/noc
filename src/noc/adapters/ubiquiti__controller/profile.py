# ---------------------------------------------------------------------
# Vendor: Ubiquiti
# OS:     Controller
# ---------------------------------------------------------------------
# Copyright (C) 2007-2023 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.core.profile.base import BaseProfile


class Profile(BaseProfile):
    name = "Ubiquiti.Controller"

    http_request_middleware = [
        "noc.adapters.ubiquiti__controller.middleware.ubiquityauth.UbiquitiAuthMiddeware",
    ]
