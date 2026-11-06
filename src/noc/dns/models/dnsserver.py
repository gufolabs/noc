# ---------------------------------------------------------------------
# DNSServer model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Future imports
from __future__ import annotations

# Third-party modules
from django.db import models

# NOC modules
from noc.config import config
from noc.core.change.decorator import change
from noc.core.model.base import NOCModel
from noc.core.model.decorator import on_init
from noc.core.model.fields import INETField

# Third-party modules modules


@on_init
@change
class DNSServer(NOCModel):
    """
    DNS Server is an database object representing real DNS server.

    :param name: Unique DNS server name (usually, FQDN)
    :param ip: Server's IP address
    :param description: Optional description

    Attributes:
        name: Name
        ip: IP
        description: Description
    """

    class Meta:
        db_table = "dns_dnsserver"
        app_label = "dns"

    name = models.CharField(max_length=64, unique=True)
    ip = INETField(null=True, blank=True)
    description = models.CharField(max_length=128, blank=True, null=True)

    def __str__(self):
        return self.name

    @classmethod
    def get_by_id(cls, oid: int) -> DNSServer | None:
        return DNSServer.objects.filter(id=oid).first()

    def iter_changed_datastream(self, changed_fields=None):
        if not config.datastream.enable_dnszone:
            return
        for zp in self.masters.all():
            for ds, id in zp.iter_changed_datastream(changed_fields=changed_fields):
                yield ds, id
        for zp in self.slaves.all():
            for ds, id in zp.iter_changed_datastream(changed_fields=changed_fields):
                yield ds, id
