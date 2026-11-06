# ---------------------------------------------------------------------
# DateTime utilities
# ---------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import bisect
import datetime as dt

# NOC modules
from noc.core.i18n import t


def humanize_timedelta(delta):
    def round(x):
        return int(x + 0.5)

    d = delta.days
    s = delta.seconds
    if not d:
        if s < 30:
            return t("msg-duration-less-than-minute")
        if s < 90:  # 1:30
            return t("msg-duration-minutes", count=1)
        if s < 2670:  # 44:30
            return t("msg-duration-minutes", count=round(float(s) / 60.0))
        if s < 5370:  # 1:29:30
            return t("msg-duration-about-hours", count=1)
        if s < 86370:  # 24:59:30
            return t("msg-duration-about-hours", count=round(float(s) / 3600.0))
        return t("msg-duration-days", count=1)
    if d == 1 and s < 84600:  # 1D23:59:30
        return t("msg-duration-days", count=1)
    if d < 30 and s < 84600:  # 29D23:59:30
        return t("msg-duration-days", count=round((float(d) * 86400.0 + s) / 86400))
    if d < 60 and s < 84600:  # 59D23:59:30
        return t("msg-duration-about-month")
    if d < 365:
        return t("msg-duration-months", count=round(float(d) / 30))
    if d < 446:  # 1Y 3M
        return t("msg-duration-about-year")
    if d < 626:  # 1Y 9M
        return t("msg-duration-over-year")
    if d < 730:  # 2Y
        return t("msg-duration-almost-two-years")
    n = d // 365
    dd = d - n * 356
    if dd < 446:
        return t("msg-duration-about-years", count=n)
    if dd < 626:
        return t("msg-duration-over-years", count=n)
    return t("msg-duration-almost-years", count=n + 1)


def humanize_distance(d):
    try:
        dist = humanize_timedelta(dt.datetime.now() - d)
    except TypeError:
        dist = t("msg-duration-never")
    return dist


def total_seconds(td: dt.timedelta) -> float:
    """
    Return total seconds in timedelta object
    Args:
        td: timedelta
    Returns:
        seconds
    """
    return (td.microseconds + (td.seconds + td.days * 86400) * 1000000) / 1000000.0


def hits_in_range(timestamps, start, stop):
    """
    Count timestamps falling in given range
    Args:
        timestamps: Ordered list of timestamps
        start: starting timestamp (datetime)
        stop: ending timestamp (datetime)
    Returns:
        Number of hits
    """
    s = bisect.bisect_left(timestamps, start)
    e = bisect.bisect_right(timestamps, stop, s)
    return sum(1 for ts in timestamps[s:e] if start <= ts <= stop)
