# ----------------------------------------------------------------------
# Alarms Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.config import config
from noc.core.bi.dictionaries.administrativedomain import AdministrativeDomain
from noc.core.bi.dictionaries.alarmclass import AlarmClass
from noc.core.bi.dictionaries.container import Container
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.networksegment import NetworkSegment
from noc.core.bi.dictionaries.objectprofile import ObjectProfile
from noc.core.bi.dictionaries.platform import Platform
from noc.core.bi.dictionaries.pool import Pool
from noc.core.bi.dictionaries.profile import Profile
from noc.core.bi.dictionaries.project import Project
from noc.core.bi.dictionaries.vendor import Vendor
from noc.core.bi.dictionaries.version import Version
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    Float64Field,
    Int16Field,
    Int32Field,
    Int64Field,
    IPv4Field,
    NestedField,
    ReferenceField,
    StringField,
    UInt32Field,
)
from noc.core.clickhouse.model import Model, NestedModel
from noc.sa.models.administrativedomain import AdministrativeDomain as AdministrativeDomainM
from noc.sa.models.useraccess import UserAccess


class Services(NestedModel):
    """
    Attributes:
        profile: Profile Name
        summary: Summary
    """

    profile = StringField()
    summary = UInt32Field()


class Subscribers(NestedModel):
    """
    Attributes:
        profile: Profile Name
        summary: Summary
    """

    profile = StringField()
    summary = UInt32Field()


class Alarms(Model):
    """
    Attributes:
        date: Date
        ts: Created
        close_ts: Close Time
        duration: Duration
        alarm_id: Id
        root: Alarm Root
        rca_type: RCA Type
        alarm_class: Alarm Class
        severity: Severity
        reopens: Reopens
        direct_services: Direct Services
        direct_subscribers: Direct Subscribers
        total_objects: Total Objects
        total_services: Total Services
        total_subscribers: Total Subscribers
        escalation_ts: Escalation Time
        escalation_tt: Number of Escalation
        reboots: Qty of Reboots
        managed_object: Object Name
        pool: Pool Name
        object_profile: Object Profile
        ip: IP Address
        profile: Profile
        vendor: Vendor Name
        platform: Platform
        version: Version
        administrative_domain: Admin. Domain
        segment: Network Segment
        container: Container
        project: Project
        x: Longitude
        y: Latitude
        services: Affected Services
        subscribers: Affected Subscribers
        ack_user: Manual acknowledgement user name
        ack_ts: Manual acknowledgement timestamp
    """

    class Meta:
        db_table = "alarms"
        engine = MergeTree(
            "date", ("ts", "managed_object", "alarm_class"), primary_keys=("ts", "managed_object")
        )

    date = DateField()
    ts = DateTimeField()
    close_ts = DateTimeField()
    duration = Int32Field()
    alarm_id = StringField()
    root = StringField()
    rca_type = Int16Field()
    alarm_class = ReferenceField(AlarmClass)
    severity = Int32Field()
    reopens = Int32Field()
    direct_services = Int64Field()
    direct_subscribers = Int64Field()
    total_objects = Int64Field()
    total_services = Int64Field()
    total_subscribers = Int64Field()
    escalation_ts = DateTimeField()
    escalation_tt = StringField()
    # Amount of reboots during alarm
    reboots = Int16Field()
    managed_object = ReferenceField(ManagedObject)
    pool = ReferenceField(Pool)
    object_profile = ReferenceField(ObjectProfile)
    ip = IPv4Field()
    profile = ReferenceField(Profile)
    vendor = ReferenceField(Vendor)
    platform = ReferenceField(Platform)
    version = ReferenceField(Version)
    administrative_domain = ReferenceField(AdministrativeDomain)
    segment = ReferenceField(NetworkSegment)
    container = ReferenceField(Container)
    project = ReferenceField(Project)
    # Coordinates
    x = Float64Field()
    y = Float64Field()
    services = NestedField(Services)
    subscribers = NestedField(Subscribers)
    # location = StringField(description="Location")
    # Ack info
    ack_user = StringField()
    ack_ts = DateTimeField()

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
    def transform_field(cls, field):
        if field == "services":
            return ",".join(
                [
                    f"arrayStringConcat(arrayMap(x -> concat(dictGetString('{config.clickhouse.db_dictionaries}.serviceprofile'",
                    " 'name', toUInt64(services.profile[indexOf(services.summary, x)]))",
                    " ':', toString(x)), services.summary),',')",
                ]
            )

        if field == "subscribers":
            return ",".join(
                [
                    f"arrayStringConcat(arrayMap(x -> concat(dictGetString('{config.clickhouse.db_dictionaries}.subscriberprofile'",
                    " 'name', toUInt64(subscribers.profile[indexOf(subscribers.summary, x)]))",
                    " ':', toString(x)), subscribers.summary),',')",
                ]
            )
        return field
