# ---------------------------------------------------------------------
# NOC.UPS.get_metrics
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# NOC modules
from noc.sa.profiles.Generic.get_metrics import Script as GetMetricsScript
from noc.core.mib import mib
from noc.core.script.metrics import scale


class Script(GetMetricsScript):
    name = "NOC.UPS.get_metrics"

    SENSOR_OID_SCALE = {
        mib["UPS-MIB::upsInputFrequency", 1]: scale(0.1, 2),
        mib["UPS-MIB::upsInputFrequency", 2]: scale(0.1, 2),
        mib["UPS-MIB::upsInputFrequency", 3]: scale(0.1, 2),
        mib["UPS-MIB::upsInputFrequency", 1, 0]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputFrequency", 1]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputFrequency", 2]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputFrequency", 3]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputFrequency", 1, 0]: scale(0.1, 2),
        mib["UPS-MIB::upsInputCurrent", 1]: scale(0.1, 2),
        mib["UPS-MIB::upsInputCurrent", 2]: scale(0.1, 2),
        mib["UPS-MIB::upsInputCurrent", 3]: scale(0.1, 2),
        mib["UPS-MIB::upsInputCurrent", 1, 0]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputCurrent", 1]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputCurrent", 2]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputCurrent", 3]: scale(0.1, 2),
        mib["UPS-MIB::upsOutputCurrent", 1, 0]: scale(0.1, 2),
        mib["UPS-MIB::upsBypassCurrent", 1]: scale(0.1, 2),
        mib["UPS-MIB::upsBypassCurrent", 2]: scale(0.1, 2),
        mib["UPS-MIB::upsBypassCurrent", 3]: scale(0.1, 2),
        mib["UPS-MIB::upsBypassCurrent", 1, 0]: scale(0.1, 2),
        mib["UPS-MIB::upsEstimatedMinutesRemaining", 0]: scale(60),
        mib["UPS-MIB::upsBatteryVoltage", 0]: scale(0.1, 2),
        mib["UPS-MIB::upsBatteryCurrent", 0]: scale(0.1, 2),
    }
