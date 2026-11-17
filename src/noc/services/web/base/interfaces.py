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
    def clean(self, value):
        if value is None and self.default is not None:
            return self.default
        if isinstance(value, dt.datetime):
            return value
        try:
            value = dt.datetime.fromisoformat(value)
        except (TypeError, ValueError):
            self.raise_error("Invalid DateTime")
        if value.tzinfo is not None:
            value = value.astimezone(dt.UTC).replace(tzinfo=None)
        return value


class DateParameter(DateTimeParameter):
    def clean(self, value):
        return super().clean(value).date()
