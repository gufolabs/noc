# ----------------------------------------------------------------------
# Check History model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.remotesystem import RemoteSystem
from noc.core.bi.dictionaries.service import Service
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    BooleanField,
    DateField,
    DateTimeField,
    IPv4Field,
    MapField,
    ReferenceField,
    StringField,
    UInt16Field,
    UInt32Field,
)
from noc.core.clickhouse.model import Model


class CheckHistory(Model):
    """
    Attributes:
        date: Date
        ts: Created
        check_name: Check Name
        status: Check Result status
        key: Check Key
        ttl: Check actual time (in seconds)
        port: TCP/UDP Port
        source: Source
        script: Diagnostic Name
        data: Collected data (JSON)
        managed_object: Running for object
        service: Object Name
        remote_system: Remote System
        args: Running Argument
        address: Destination IP Address
        error: Error text
        error_code: Error code
    """

    class Meta:
        db_table = "checkhistory"
        engine = MergeTree("date", ("date", "check_name"), primary_keys=("date", "check_name"))

    date = DateField()
    ts = DateTimeField()
    check_name = StringField(low_cardinality=True)
    status = BooleanField()
    key = StringField()
    ttl = UInt32Field()
    args = MapField(StringField())
    port = UInt16Field()
    address = IPv4Field()
    source = StringField(low_cardinality=True)
    script = StringField(low_cardinality=True)
    skipped = BooleanField()
    # Error
    error = StringField()
    error_code = StringField()
    is_available = BooleanField()
    is_access = BooleanField()
    data = StringField()
    managed_object = ReferenceField(ManagedObject)
    service = ReferenceField(Service)
    # agent = ReferenceField(Agent, description=_("Object Name"))
    remote_system = ReferenceField(RemoteSystem)

    @classmethod
    def transform_query(cls, query, user):
        return query
