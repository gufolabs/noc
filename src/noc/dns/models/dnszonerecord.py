# ---------------------------------------------------------------------
# DNSZoneRecord model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Future imports
from __future__ import annotations

# Third-party modules
from django.contrib.postgres.fields import ArrayField
from django.db import models

# NOC modules
from noc.core.change.decorator import change
from noc.core.model.base import NOCModel
from noc.core.model.decorator import on_init
from noc.main.models.label import Label

from .dnszone import DNSZone


@Label.model
@on_init
@change
class DNSZoneRecord(NOCModel):
    """
    Zone RRs

    Attributes:
        name: Name
        ttl: TTL
        type: Type
        priority: Priority
        content: Content
        zone: Zone
    """

    class Meta:
        db_table = "dns_dnszonerecord"
        app_label = "dns"

    zone: DNSZone = models.ForeignKey(DNSZone, on_delete=models.CASCADE)
    name = models.CharField(max_length=64, blank=True, null=True)
    ttl = models.IntegerField(null=True, blank=True)
    type = models.CharField(max_length=16)
    priority = models.IntegerField(null=True, blank=True)
    content = models.CharField(max_length=65536)
    labels = ArrayField(models.CharField(max_length=250), blank=True, null=True, default=list)
    effective_labels = ArrayField(
        models.CharField(max_length=250), blank=True, null=True, default=list
    )

    def __str__(self):
        return f"{self.zone.name} {' '.join(x for x in (self.name, self.type, self.content) if x)}"

    @classmethod
    def get_by_id(cls, oid: int) -> DNSZoneRecord | None:
        return DNSZoneRecord.objects.filter(id=oid).first()

    def get_changed_instance(self):
        return self.zone

    @classmethod
    def can_set_label(cls, label: str) -> bool:
        return Label.get_effective_setting(label, setting="enable_dnszonerecord")
