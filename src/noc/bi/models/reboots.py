# ----------------------------------------------------------------------
# Reboots model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.administrativedomain import AdministrativeDomain
from noc.core.bi.dictionaries.container import Container
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.networksegment import NetworkSegment
from noc.core.bi.dictionaries.objectprofile import ObjectProfile
from noc.core.bi.dictionaries.platform import Platform
from noc.core.bi.dictionaries.pool import Pool
from noc.core.bi.dictionaries.profile import Profile
from noc.core.bi.dictionaries.vendor import Vendor
from noc.core.bi.dictionaries.version import Version
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    Float64Field,
    IPv4Field,
    ReferenceField,
)
from noc.core.clickhouse.model import Model
from noc.sa.models.administrativedomain import AdministrativeDomain as AdministrativeDomainM
from noc.sa.models.useraccess import UserAccess


class Reboots(Model):
    """
    Attributes:
        date: Date
        ts: Created
        last: Last register
        managed_object: Object Name
        pool: Pool Name
        ip: IP Address
        profile: Profile
        object_profile: Object Profile
        vendor: Vendor Name
        platform: Platform
        version: Version
        administrative_domain: Admin. Domain
        segment: Network Segment
        container: Container
        x: Longitude
        y: Latitude
    """

    class Meta:
        db_table = "reboots"
        engine = MergeTree("date", ("ts", "managed_object"), primary_keys=("ts", "managed_object"))

    date = DateField()
    ts = DateTimeField()
    last = DateTimeField()
    managed_object = ReferenceField(ManagedObject)
    pool = ReferenceField(Pool)
    ip = IPv4Field()
    profile = ReferenceField(Profile)
    object_profile = ReferenceField(ObjectProfile)
    vendor = ReferenceField(Vendor)
    platform = ReferenceField(Platform)
    version = ReferenceField(Version)
    administrative_domain = ReferenceField(AdministrativeDomain)
    segment = ReferenceField(NetworkSegment)
    container = ReferenceField(Container)
    # Coordinates
    x = Float64Field()
    y = Float64Field()

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
