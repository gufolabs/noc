# ----------------------------------------------------------------------
# routing_neighbors table
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
    UInt64Field,
)
from noc.core.clickhouse.model import Model


class RoutingNeighbors(Model):
    """
    Attributes:
        date: Date
        ts: Created
        managed_object: Object Name
        interface: Physical Interface
        subinterface: Logical Interface
        neighbor_address: Neighbor Address
        neighbor_object: Neighbor Object
        protocol: Protocol
        bgp_local_as: BGP Local AS
        bgp_remote_as: BGP Remogte AS
    """

    class Meta:
        db_table = "routingneighbors"
        engine = MergeTree("date", ("managed_object", "ts"), primary_keys=("managed_object", "ts"))

    date = DateField()
    ts = DateTimeField()
    managed_object = ReferenceField(ManagedObject)
    interface = StringField()
    subinterface = StringField()
    neighbor_address = StringField()
    neighbor_object = ReferenceField(ManagedObject)
    protocol = StringField()
    bgp_local_as = UInt64Field()
    bgp_remote_as = UInt64Field()
