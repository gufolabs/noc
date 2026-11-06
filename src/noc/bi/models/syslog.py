# ----------------------------------------------------------------------
# Syslog model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    ReferenceField,
    StringField,
    UInt8Field,
)
from noc.core.clickhouse.model import Model


class Syslog(Model):
    """
    Attributes:
        date: Date
        ts: Created
        managed_object: Object Name
        facility: Facility
        severity: Severity
        message: Syslog Message
    """

    class Meta:
        db_table = "syslog"
        engine = MergeTree("date", ("managed_object", "ts"), primary_keys=("managed_object", "ts"))

    date = DateField()
    ts = DateTimeField()
    managed_object = ReferenceField(ManagedObject)
    facility = UInt8Field()
    severity = UInt8Field()
    message = StringField()

    @classmethod
    def transform_query(cls, query, user):
        return query
