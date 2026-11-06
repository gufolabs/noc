# ----------------------------------------------------------------------
# ManagedObject model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.administrativedomain import AdministrativeDomain
from noc.core.bi.dictionaries.container import Container
from noc.core.bi.dictionaries.managedobject import ManagedObject as ManagedObjectDict
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
    ArrayField,
    BooleanField,
    DateField,
    DateTimeField,
    Float32Field,
    Float64Field,
    Int32Field,
    IPv4Field,
    ReferenceField,
    StringField,
    UInt16Field,
)
from noc.core.clickhouse.model import Model
from noc.sa.models.administrativedomain import AdministrativeDomain as AdministrativeDomainM
from noc.sa.models.useraccess import UserAccess


class ManagedObject(Model):
    """
    Attributes:
        date: Date
        ts: Created
        managed_object: Object Name
        administrative_domain: Admin. Domain
        segment: Network Segment
        container: Container
        level: Level
        project: Project
        x: Longitude
        y: Latitude
        pool: Pool Name
        object_profile: Object Profile
        name: Name
        hostname: Hostname
        ip: IP Address
        is_managed: Is Managed
        profile: Profile
        vendor: Vendor
        platform: Platform
        hw_version: HW. Version
        version: Version
        bootprom_version: BootPROM. Version
        n_interfaces: Interface count
        n_subscribers: Subscribers count
        n_services: Services count
        n_neighbors: Neighbors
        n_links: Links count
        bfd_links: Links (BFD)
        cdp_links: Links (CDP)
        fdp_links: Links (FDP)
        huawei_ndp_links: Links (Huawei NDP)
        lacp_links: Links (LACP)
        lldp_links: Links (LLDP)
        mac_links: Links (MAC)
        nri_links: Links (NRI)
        oam_links: Links (OAM)
        rep_links: Links (REP)
        stp_links: Links (STP)
        udld_links: Links (UDLD)
        xmac_links: Links (xMAC)
        other_links: Links (xMAC)
        has_stp: Has STP
        has_lldp: Has LLDP
        has_cdp: Has CDP
        has_snmp: Has SNMP
        has_snmp_v1: Has SNMP v1
        has_snmp_v2c: Has SNMP v2c
        uptime: Uptime
        n_reboots: Reboots by period
        availability: Availability by period (%)
        total_unavailability: Unavailability (sec.)
        n_outages: Outagees count by period
        n_stp_topo_changes: STP Topology Changes by period
        serials: Serial Numbers
        tags: Tags
    """

    class Meta:
        db_table = "managedobjects"
        engine = MergeTree("date", ("date", "managed_object"), primary_keys=("date",))

    date = DateField()
    ts = DateTimeField()
    managed_object = ReferenceField(ManagedObjectDict)
    # Location
    administrative_domain = ReferenceField(AdministrativeDomain)
    segment = ReferenceField(NetworkSegment)
    container = ReferenceField(Container)
    location = StringField(description="Geo location")
    level = UInt16Field()
    # Project
    project = ReferenceField(Project)
    # Coordinates
    x = Float64Field()
    y = Float64Field()
    # Management
    pool = ReferenceField(Pool)
    object_profile = ReferenceField(ObjectProfile)
    name = StringField()
    hostname = StringField()
    ip = IPv4Field()
    is_managed = BooleanField()
    # Platform
    profile = ReferenceField(Profile)
    vendor = ReferenceField(Vendor)
    platform = ReferenceField(Platform)
    hw_version = StringField()
    version = ReferenceField(Version)
    bootprom_version = StringField()
    n_interfaces = Int32Field()
    n_subscribers = Int32Field()
    n_services = Int32Field()
    # Topology
    n_neighbors = Int32Field()
    n_links = Int32Field()
    bfd_links = Int32Field()
    cdp_links = Int32Field()
    fdp_links = Int32Field()
    huawei_ndp_links = Int32Field()
    lacp_links = Int32Field()
    lldp_links = Int32Field()
    mac_links = Int32Field()
    nri_links = Int32Field()
    oam_links = Int32Field()
    rep_links = Int32Field()
    stp_links = Int32Field()
    udld_links = Int32Field()
    xmac_links = Int32Field()
    other_links = Int32Field()
    # Capabilities
    has_stp = BooleanField()
    has_lldp = BooleanField()
    has_cdp = BooleanField()
    has_snmp = BooleanField()
    has_snmp_v1 = BooleanField()
    has_snmp_v2c = BooleanField()
    # Counter
    uptime = Float64Field()
    # Stats
    n_reboots = UInt16Field()
    availability = Float32Field()
    total_unavailability = UInt16Field()
    n_outages = UInt16Field()
    # Metrics stats
    n_stp_topo_changes = UInt16Field()
    # SerialNumber
    serials = ArrayField(StringField())
    # Tags
    tags = ArrayField(StringField())

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
