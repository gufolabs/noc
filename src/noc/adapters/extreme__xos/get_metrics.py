# ----------------------------------------------------------------------
# Extreme.XOS.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2016 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_metrics import Script as GetMetricsScript


class Script(GetMetricsScript):
    name = "Extreme.XOS.get_metrics"
