# ----------------------------------------------------------------------
# DisposeLog Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.alarmclass import AlarmClass
from noc.core.bi.dictionaries.eventclass import EventClass
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    MapField,
    ReferenceField,
    StringField,
    UInt32Field,
    UInt64Field,
)
from noc.core.clickhouse.model import Model


class DisposeLog(Model):
    """
    Attributes:
        date: Date
        ts: Created
        event_id: Event ID
        alarm_id: Alarm ID
        op: Operation
        managed_object: Object Name
        event_class: Event Class
        alarm_class: Alarm Class
        message: Event Message
        target: Target
        reopens: Reopens
    """

    class Meta:
        db_table = "disposelog"
        engine = MergeTree(
            "date",
            ("date", "managed_object"),
            primary_keys=("date", "managed_object"),
            partition_function="toYYYYMMDD(ts)",
        )

    date = DateField()
    ts = DateTimeField()
    event_id = StringField()
    alarm_id = StringField()
    op = StringField(low_cardinality=True)  # raise, clear, drop, ignore
    managed_object = ReferenceField(ManagedObject)
    event_class = ReferenceField(EventClass)
    alarm_class = ReferenceField(AlarmClass)
    message = StringField()
    target = MapField(StringField())
    target_reference = UInt64Field(description="Target reference")
    reopens = UInt32Field()
