# ---------------------------------------------------------------------
# REST helper interfaces
# ---------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import datetime as dt

# NOC modules
from noc.sa.interfaces.base import StringParameter


class DateTimeParameter(StringParameter):
    formats = ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%d")

    def clean(self, value):
        if value is None and self.default is not None:
            return self.default
        if isinstance(value, dt.datetime):
            return value
        try:
            parsed = dt.datetime.fromisoformat(value)
        except (TypeError, ValueError):
            if not isinstance(value, str):
                self.raise_error("Invalid DateTime")
            for fmt in self.formats:
                try:
                    parsed = dt.datetime.strptime(value, fmt)
                    break
                except ValueError:
                    continue
            else:
                self.raise_error("Invalid DateTime")
        if parsed.tzinfo is not None:
            parsed = parsed.astimezone(dt.UTC).replace(tzinfo=None)
        return parsed


class DateParameter(DateTimeParameter):
    def clean(self, value):
        return super().clean(value).date()
