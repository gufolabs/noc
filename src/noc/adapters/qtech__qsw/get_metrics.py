# ---------------------------------------------------------------------
# Qtech.QSW.get_metrics
# ---------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_metrics import Script as GetMetricsScript


class Script(GetMetricsScript):
    name = "Qtech.QSW.get_metrics"
