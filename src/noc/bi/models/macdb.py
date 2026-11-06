# ----------------------------------------------------------------------
# MACDB Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.interfaceprofile import InterfaceProfile
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.networksegment import NetworkSegment
from noc.core.clickhouse.engines import AggregatingMergeTree
from noc.core.clickhouse.fields import (
    AggregatedField,
    DateTimeField,
    ReferenceField,
    StringField,
    UInt16Field,
    UInt64Field,
)
from noc.core.clickhouse.functions import ArgMax
from noc.core.clickhouse.model import ViewModel


class MACDB(ViewModel):
    """
    Attributes:
        mac: MAC
        managed_object: Object Name
        interface_profile: Interface Profile
        segment: Network Segment
        last_seen: Last Seen mac
        interface: Interface
        vlan: Vlan Number
    """

    class Meta:
        db_table = "macdb"
        view_table_source = "raw_mac"
        engine = AggregatingMergeTree(
            None,
            (
                "mac",
                "managed_object",
            ),
            primary_keys=("mac", "managed_object"),
        )

    last_seen = AggregatedField(
        "ts",
        DateTimeField(),
        ArgMax(),
    )
    mac = UInt64Field()
    managed_object = ReferenceField(ManagedObject)
    interface = AggregatedField(
        "interface",
        StringField(),
        ArgMax(),
    )
    interface_profile = AggregatedField(
        "interface_profile",
        ReferenceField(InterfaceProfile),
        ArgMax(),
    )
    segment = AggregatedField(
        "segment",
        ReferenceField(NetworkSegment),
        ArgMax(),
    )
    vlan = AggregatedField(
        "vlan",
        UInt16Field(),
        ArgMax(),
    )
