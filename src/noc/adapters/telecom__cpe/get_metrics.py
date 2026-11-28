# ---------------------------------------------------------------------
# Telecom.CPE.get_metrics
# ---------------------------------------------------------------------
# Copyright (C) 2023-2024 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_metrics import Script as GetMetricsScript


class Script(GetMetricsScript):
    name = "Telecom.CPE.get_metrics"
