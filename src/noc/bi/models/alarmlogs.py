# ----------------------------------------------------------------------
# Alarm Logs Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.alarmclass import AlarmClass
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    ReferenceField,
    StringField,
)
from noc.core.clickhouse.model import Model


class AlarmLogs(Model):
    """
    Attributes:
        date: Date
        ts: Log Created
        alarm_id: Id
        alarm_ts: Alarm Clear Time
        alarm_clear_ts: Alarm Close Time
        alarm_class: Alarm Class
        managed_object: Object Name
        ack_user: Manual acknowledgement user name
        ack_ts: Manual acknowledgement timestamp
        alarm_escalation_ts: Escalation Time
        alarm_escalation_tt: Number of Escalation
        from_status: Message Source
        to_status: Message Source
        source: Message Source
        message: Log Message
    """

    class Meta:
        db_table = "alarmlogs"
        engine = MergeTree("date", ("ts", "alarm_id"), primary_keys=("ts", "alarm_id"))

    date = DateField()
    ts = DateTimeField()
    alarm_id = StringField()
    alarm_ts = DateTimeField()
    alarm_clear_ts = DateTimeField()
    alarm_class = ReferenceField(AlarmClass)
    managed_object = ReferenceField(ManagedObject)
    ack_user = StringField()
    ack_ts = DateTimeField()
    alarm_escalation_ts = DateTimeField()
    alarm_escalation_tt = StringField()
    from_status = StringField(low_cardinality=True)
    to_status = StringField(low_cardinality=True)
    source = StringField(low_cardinality=True)
    message = StringField()
