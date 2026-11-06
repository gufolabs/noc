# ----------------------------------------------------------------------
# initial
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    def migrate(self) -> None:
        # Model 'DNSZoneProfile'
        self.db.create_table(
            "dns_dnszoneprofile",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=32, unique=True)),
                ("zone_transfer_acl", models.CharField(max_length=64)),
                ("zone_ns_list", models.CharField(max_length=64)),
                ("zone_soa", models.CharField(max_length=64)),
                ("zone_contact", models.CharField(max_length=64)),
                ("zone_refresh", models.IntegerField(default=3600)),
                ("zone_retry", models.IntegerField(default=900)),
                ("zone_expire", models.IntegerField(default=86400)),
                ("zone_ttl", models.IntegerField(default=3600)),
            ),
        )

        # Mock Models
        DNSZoneProfile = self.db.mock_model(
            model_name="DNSZoneProfile", db_table="dns_dnszoneprofile"
        )

        # Model 'DNSZone'
        self.db.create_table(
            "dns_dnszone",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                (
                    "description",
                    models.CharField(null=True, blank=True, max_length=64),
                ),
                ("is_auto_generated", models.BooleanField()),
                ("serial", models.CharField(max_length=10, default="0000000000")),
                (
                    "profile",
                    models.ForeignKey(DNSZoneProfile, on_delete=models.CASCADE),
                ),
            ),
        )
        # Model 'DNSZoneRecordType'
        self.db.create_table(
            "dns_dnszonerecordtype",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("type", models.CharField(max_length=16, unique=True)),
            ),
        )

        # Mock Models
        DNSZone = self.db.mock_model(model_name="DNSZone", db_table="dns_dnszone")
        DNSZoneRecordType = self.db.mock_model(
            model_name="DNSZoneRecordType", db_table="dns_dnszonerecordtype"
        )

        # Model 'DNSZoneRecord'
        self.db.create_table(
            "dns_dnszonerecord",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("zone", models.ForeignKey(DNSZone, on_delete=models.CASCADE)),
                ("left", models.CharField(max_length=32, blank=True, null=True)),
                (
                    "type",
                    models.ForeignKey(DNSZoneRecordType, on_delete=models.CASCADE),
                ),
                ("right", models.CharField(max_length=64)),
            ),
        )
