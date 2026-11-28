# ----------------------------------------------------------------------
# NAG.SNR_eNOS.get_metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2024 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.adapters.generic__host.get_metrics import Script as GetMetricsScript


class Script(GetMetricsScript):
    name = "NAG.SNR_eNOS.get_metrics"
