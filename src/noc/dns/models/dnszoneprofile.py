# ---------------------------------------------------------------------
# DNSZoneProfile model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Future imports
from __future__ import annotations

# Python modules
import operator
from threading import Lock

# Third-party modules
import cachetools
from django.db import models

# NOC modules
from noc.config import config
from noc.core.change.decorator import change
from noc.core.model.base import NOCModel
from noc.core.model.decorator import on_delete_check, on_init
from noc.main.models.notificationgroup import NotificationGroup

from .dnsserver import DNSServer

id_lock = Lock()


@on_init
@change
@on_delete_check(check=[("dns.DNSZone", "profile")])
class DNSZoneProfile(NOCModel):
    """
    DNS Zone profile is a set of common parameters, shared between zones.

    Attributes:
        notification_group: Notification group to use when zone group is not set
        name: Name
        zone_soa: SOA
        zone_contact: Contact
        zone_refresh: Refresh
        zone_retry: Retry
        zone_expire: Expire
        zone_ttl: TTL
        description: Description
        masters: Masters
        slaves: Slaves
    """

    class Meta:
        db_table = "dns_dnszoneprofile"
        app_label = "dns"

    name = models.CharField(max_length=32, unique=True)
    masters = models.ManyToManyField(DNSServer, related_name="masters", blank=True)
    slaves = models.ManyToManyField(DNSServer, related_name="slaves", blank=True)
    zone_soa = models.CharField(max_length=64)
    zone_contact = models.CharField(max_length=64)
    zone_refresh = models.IntegerField(default=3600)
    zone_retry = models.IntegerField(default=900)
    zone_expire = models.IntegerField(default=86400)
    zone_ttl = models.IntegerField(default=3600)
    notification_group = models.ForeignKey(
        NotificationGroup,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    description = models.TextField(blank=True, null=True)

    _id_cache = cachetools.TTLCache(maxsize=100, ttl=60)
    _name_cache = cachetools.TTLCache(maxsize=100, ttl=60)

    def __str__(self):
        return self.name

    @classmethod
    @cachetools.cachedmethod(operator.attrgetter("_id_cache"), lock=lambda _: id_lock)
    def get_by_id(cls, oid: int) -> DNSZoneProfile | None:
        return DNSZoneProfile.objects.filter(id=oid).first()

    @classmethod
    @cachetools.cachedmethod(operator.attrgetter("_name_cache"), lock=lambda _: id_lock)
    def get_by_name(cls, name: str) -> DNSZoneProfile | None:
        return DNSZoneProfile.objects.filter(name=name).first()

    def iter_changed_datastream(self, changed_fields=None):
        if not config.datastream.enable_dnszone:
            return
        for z in self.dnszone_set.all():
            yield from z.iter_changed_datastream(changed_fields=changed_fields)

    @property
    def authoritative_servers(self):
        """
        Returns a list of DNSServer instances for all zone's master and
        slave servers
        """
        return list(self.masters.all()) + list(self.slaves.all())
