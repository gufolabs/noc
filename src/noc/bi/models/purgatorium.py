# ----------------------------------------------------------------------
# Purgatorium
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.pool import Pool
from noc.core.bi.dictionaries.remotesystem import RemoteSystem
from noc.core.clickhouse.engines import ReplacingMergeTree
from noc.core.clickhouse.fields import (
    ArrayField,
    BooleanField,
    DateField,
    DateTimeField,
    IPv4Field,
    MapField,
    MaterializedField,
    ReferenceField,
    StringField,
    UInt64Field,
)
from noc.core.clickhouse.model import Model


class Purgatorium(Model):
    """
    Attributes:
        date: Date
        ts: Registered Record
        pool: Pool Name
        refs: Unique reference for deduplicate records
        border: Object Name
        data: Vars
        caps: Capabilities
        labels: Tags
        service_groups: Service Groups Ids
        clients_groups: Client Groups Ids
        remote_system: Remote System
        ip: IP Address
        router_id: Router ID IP Address, user for origin
        description: Description
        chassis_id: Chassis ID
        hostname: Hostname Discovery
        uptime: Host Uptime
        is_delete: Address was removed from RemoteSystem
        remote_id: Remote System Id
    """

    class Meta:
        db_table = "purgatorium"
        engine = ReplacingMergeTree(
            "date",
            ("pool", "ip", "source", "remote_system"),
        )

    date = DateField()
    ts = DateTimeField()
    # Require fields
    ip = IPv4Field()
    pool = ReferenceField(Pool)
    source = StringField(low_cardinality=True)
    router_id = IPv4Field()
    # network-scan
    # neighbors
    # syslog-source
    # trap-source
    # manual
    # etl
    # Network-Scan, Neighbor fields
    description = StringField()
    chassis_id = StringField()
    hostname = StringField()
    refs = ArrayField(StringField())
    uptime = UInt64Field()
    border = ReferenceField(ManagedObject)
    # Set for records on RemoteSystem
    data = MapField(StringField())
    caps = MapField(StringField())
    # Json Field  {check: str PING, avail: True/False, access: None, error: None, port}
    checks = ArrayField(StringField())
    success_checks = MaterializedField(
        ArrayField(StringField(low_cardinality=True)),
        """arrayMap(
             x -> trim(TRAILING ':' from concat(JSONExtractString(x, 'check'), ':', JSONExtractString(x, 'port'))),
             arrayFilter(c -> JSONExtractBool(c, 'status') ,checks)
         )""",
        low_cardinality=False,
    )
    # http, telegraf HTTP and port 3000, regex - status: avail & access & app (regex)
    is_delete = BooleanField(default=False)
    # Labels List
    labels = ArrayField(StringField())
    service_groups = ArrayField(UInt64Field())
    clients_groups = ArrayField(UInt64Field())
    remote_system = ReferenceField(RemoteSystem)
    remote_id = StringField()
    # Maybe fields for detect hints
    # available_ports - detect open TCP port
    # maybe_agent
    # maybe_managed_object - bool

    @classmethod
    def fix_column_type(cls, connect, name: str):
        """Fix column name"""
        print("ReCreate column remote_system")
        if name == "remote_system":
            connect.execute(
                f"ALTER TABLE `{cls._get_db_table()}` DROP COLUMN {cls.quote_name(name)}",
            )
            connect.execute(
                f"ALTER TABLE `{cls._get_db_table()}` ADD COLUMN {cls.quote_name(name)} {ReferenceField.db_type}",
            )
