# ----------------------------------------------------------------------
# Events Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.config import config
from noc.core.bi.dictionaries.administrativedomain import AdministrativeDomain
from noc.core.bi.dictionaries.container import Container
from noc.core.bi.dictionaries.eventclass import EventClass
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.networksegment import NetworkSegment
from noc.core.bi.dictionaries.platform import Platform
from noc.core.bi.dictionaries.pool import Pool
from noc.core.bi.dictionaries.profile import Profile
from noc.core.bi.dictionaries.remotesystem import RemoteSystem
from noc.core.bi.dictionaries.service import Service
from noc.core.bi.dictionaries.vendor import Vendor
from noc.core.bi.dictionaries.version import Version
from noc.core.clickhouse.connect import ClickhouseClient
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    ArrayField,
    DateField,
    DateTimeField,
    Int8Field,
    IPv4Field,
    MapField,
    ReferenceField,
    StringField,
    UInt64Field,
)
from noc.core.clickhouse.model import Model
from noc.sa.models.administrativedomain import AdministrativeDomain as AdministrativeDomainM
from noc.sa.models.useraccess import UserAccess


class Events(Model):
    """
    Attributes:
        date: Date
        ts: Register
        start_ts: Created
        event_id: Id
        source: Event Source
        event_class: Event Class
        labels: Labels
        message: Syslog Message
        raw_vars: Raw Variables
        resolved_vars: Resolved Variables
        vars: Vars
        snmp_trap_oid: snmp Trap OID
        target: Target
        target_name: Target Name
        target_reference: Target Reference
        pool: Pool Name
        ip: IP Address
        managed_object: Object Name
        services: Services List
        profile: Profile
        vendor: Vendor Name
        platform: Platform
        version: Version
        administrative_domain: Admin. Domain
        segment: Network Segment
        container: Container
    """

    class Meta:
        db_table = "events"
        engine = MergeTree(
            "date",
            ("date", "managed_object", "event_class"),
            primary_keys=("date", "managed_object"),
            partition_function="toYYYYMMDD(ts)",
        )

    date = DateField()
    ts = DateTimeField()
    start_ts = DateTimeField()
    # Event Classification
    event_id = StringField()
    source = StringField(low_cardinality=True)
    event_class = ReferenceField(EventClass)
    # Data
    labels = ArrayField(StringField())
    data = StringField(description="All data on JSON")
    message = StringField()
    # Calculated data
    raw_vars = MapField(StringField())  # For old query
    resolved_vars = MapField(StringField())
    vars = MapField(StringField())
    snmp_trap_oid = StringField()
    severity = Int8Field(description="EventSeverity")
    result_action = StringField(description="Result action for event")
    error_message = StringField(description="Error message")
    remote_system = ReferenceField(RemoteSystem, description="Remote System")
    remote_id = StringField(description="Event Id on Remote System")
    # Target data
    target = MapField(StringField())
    target_name = StringField()
    target_reference = UInt64Field()
    pool = ReferenceField(Pool)
    ip = IPv4Field()
    # Resolver target
    managed_object = ReferenceField(ManagedObject)
    services = ArrayField(ReferenceField(Service))
    # Agent
    profile = ReferenceField(Profile)
    vendor = ReferenceField(Vendor)
    platform = ReferenceField(Platform)
    version = ReferenceField(Version)
    administrative_domain = ReferenceField(AdministrativeDomain)
    segment = ReferenceField(NetworkSegment)
    container = ReferenceField(Container)

    @classmethod
    def transform_query(cls, query, user):
        if not user or user.is_superuser:
            return query  # No restrictions
        # Get user domains
        domains = UserAccess.get_domains(user)
        # Resolve domains against dict
        domain_ids = [x.bi_id for x in AdministrativeDomainM.objects.filter(id__in=domains)]
        filter = query.get("filter", {})
        dl = len(domain_ids)
        if not dl:
            return None
        if dl == 1:
            q = {"$eq": [{"$field": "administrative_domain"}, domain_ids[0]]}
        else:
            q = {"$in": [{"$field": "administrative_domain"}, domain_ids]}
        if filter:
            query["filter"] = {"$and": [query["filter"], q]}
        else:
            query["filter"] = q
        return query

    @classmethod
    def check_old_schema(cls, connect: "ClickhouseClient", table_name: str) -> bool:
        """
        Check syntax
        :return:
        """
        c1 = super().check_old_schema(connect=connect, table_name=table_name)
        # Check repeat_hash column
        c2 = connect.execute(
            f"""
        SELECT database
        FROM system.columns
        WHERE database = '{config.clickhouse.db}' AND table = 'events' AND name = 'repeat_hash'
        """
        )
        return not c2 and c1
