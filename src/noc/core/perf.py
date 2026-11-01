# ----------------------------------------------------------------------
# Performance metrics
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections import defaultdict

# Third-party modules
from atomicl import AtomicLong

#
# Performance metrics
#
metrics = defaultdict(lambda: AtomicLong(0))


def apply_metrics(d):
    """
    Apply metrics value to dictionary d
    Args:
        d: Dictionary
    Returns:
        The input dictionary updated with the current metrics values.
    """
    for k, v in metrics.items():
        if isinstance(v, AtomicLong):
            v = v.value
        d[k] = v
    return d
