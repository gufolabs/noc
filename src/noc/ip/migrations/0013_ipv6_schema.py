# ----------------------------------------------------------------------
# ipv6 schema
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.model.fields import AutoCompleteTagsField, CIDRField, INETField, MACField


class Migration(BaseMigration):
    depends_on = [("main", "0027_style")]

    def migrate(self) -> None:
        AFI_CHOICES = [("4", "IPv4"), ("6", "IPv6")]
        # Style
        Style = self.db.mock_model(model_name="Style", db_table="main_style")
        # VRF Group
        self.db.add_column(
            "ip_vrfgroup",
            "address_constraint",
            models.CharField(
                max_length=1,
                choices=[
                    ("V", "Addresses are unique per VRF"),
                    ("G", "Addresses are unique per VRF Group"),
                ],
                default="V",
            ),
        )
        self.db.execute("ALTER TABLE ip_vrfgroup ALTER COLUMN description TYPE TEXT")
        self.db.execute("ALTER TABLE ip_vrfgroup ALTER COLUMN description DROP NOT NULL")
        self.db.execute("ALTER TABLE ip_vrfgroup ALTER COLUMN description SET DEFAULT 'V'")
        self.db.add_column("ip_vrfgroup", "tags", AutoCompleteTagsField(null=True, blank=True))
        # VRF
        self.db.add_column("ip_vrf", "is_active", models.BooleanField(default=True))
        self.db.add_column("ip_vrf", "afi_ipv4", models.BooleanField(default=True))
        self.db.add_column("ip_vrf", "afi_ipv6", models.BooleanField(default=False))
        self.db.execute("ALTER TABLE ip_vrf ALTER COLUMN description TYPE TEXT")
        self.db.execute("ALTER TABLE ip_vrf ALTER COLUMN description DROP NOT NULL")
        self.db.execute("ALTER TABLE ip_vrf ALTER COLUMN description SET DEFAULT 'V'")
        self.db.add_column(
            "ip_vrf",
            "style",
            models.ForeignKey(Style, blank=True, null=True, on_delete=models.CASCADE),
        )
        self.db.add_column("ip_vrf", "allocated_till", models.DateField(null=True, blank=True))
        # Prefix
        VRF = self.db.mock_model(model_name="VRF", db_table="ip_vrf")
        AS = self.db.mock_model(model_name="AS", db_table="peer_as")
        VC = self.db.mock_model(model_name="VC", db_table="vc_vc")
        ManagedObject = self.db.mock_model(model_name="ManagedObject", db_table="sa_managedobject")
        Prefix = self.db.mock_model(model_name="Prefix", db_table="ip_prefix")

        self.db.create_table(
            "ip_prefix",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "parent",
                    models.ForeignKey(
                        Prefix,
                        related_name="children_set",
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                ("vrf", models.ForeignKey(VRF, on_delete=models.CASCADE)),
                ("afi", models.CharField(max_length=1, choices=AFI_CHOICES)),
                ("prefix", CIDRField()),
                ("asn", models.ForeignKey(AS, on_delete=models.CASCADE)),
                (
                    "vc",
                    models.ForeignKey(VC, null=True, blank=True, on_delete=models.CASCADE),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("tags", AutoCompleteTagsField(null=True, blank=True)),
                ("tt", models.IntegerField(blank=True, null=True)),
                (
                    "style",
                    models.ForeignKey(Style, blank=True, null=True, on_delete=models.CASCADE),
                ),
                ("allocated_till", models.DateField(null=True, blank=True)),
            ),
        )
        self.db.create_index("ip_prefix", ["vrf_id", "afi", "prefix"], unique=True)
        # Address
        self.db.create_table(
            "ip_address",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "prefix",
                    models.ForeignKey(Prefix, on_delete=models.CASCADE),
                ),
                ("vrf", models.ForeignKey(VRF, on_delete=models.CASCADE)),
                ("afi", models.CharField(max_length=1, choices=AFI_CHOICES)),
                ("address", INETField()),
                ("fqdn", models.CharField(max_length=255)),
                ("mac", MACField(null=True, blank=True)),
                ("auto_update_mac", models.BooleanField(default=False)),
                (
                    "managed_object",
                    models.ForeignKey(
                        ManagedObject,
                        null=True,
                        blank=True,
                        related_name="address_set",
                        on_delete=models.CASCADE,
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                ("tags", AutoCompleteTagsField(null=True, blank=True)),
                ("tt", models.IntegerField(blank=True, null=True)),
                (
                    "style",
                    models.ForeignKey(Style, blank=True, null=True, on_delete=models.CASCADE),
                ),
                ("allocated_till", models.DateField(null=True, blank=True)),
            ),
        )
        self.db.create_index("ip_address", ["prefix_id", "vrf_id", "afi", "address"], unique=True)
        # PrefixAccess
        User = self.db.mock_model(model_name="User", db_table="auth_user")
        self.db.create_table(
            "ip_prefixaccess",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("user", models.ForeignKey(User, on_delete=models.CASCADE)),
                ("vrf", models.ForeignKey(VRF, on_delete=models.CASCADE)),
                ("afi", models.CharField(max_length=1, choices=AFI_CHOICES)),
                ("prefix", CIDRField()),
                ("can_view", models.BooleanField(default=False)),
                ("can_change", models.BooleanField(default=False)),
            ),
        )
        self.db.create_index("ip_prefixaccess", ["user_id", "vrf_id", "afi", "prefix"], unique=True)
        # AddressRange
        self.db.create_table(
            "ip_addressrange",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("vrf", models.ForeignKey(VRF, on_delete=models.CASCADE)),
                ("afi", models.CharField(max_length=1, choices=AFI_CHOICES)),
                ("from_address", INETField()),
                ("to_address", INETField()),
                ("description", models.TextField(blank=True, null=True)),
                ("is_locked", models.BooleanField(default=True)),
                (
                    "action",
                    models.CharField(
                        max_length=1,
                        choices=[
                            ("N", "Do nothing"),
                            ("G", "Generate FQDNs"),
                            ("D", "Partial reverse zone delegation"),
                        ],
                        default="N",
                    ),
                ),
                (
                    "fqdn_template",
                    models.CharField(max_length=255, null=True, blank=True),
                ),
                (
                    "reverse_nses",
                    models.CharField(max_length=255, null=True, blank=True),
                ),
                ("tags", AutoCompleteTagsField(null=True, blank=True)),
                ("tt", models.IntegerField(blank=True, null=True)),
                ("allocated_till", models.DateField(null=True, blank=True)),
            ),
        )
        self.db.create_index(
            "ip_addressrange", ["vrf_id", "afi", "from_address", "to_address"], unique=True
        )

        # PrefixBookmark
        self.db.create_table(
            "ip_prefixbookmark",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("user", models.ForeignKey(User, on_delete=models.CASCADE)),
                (
                    "prefix",
                    models.ForeignKey(Prefix, on_delete=models.CASCADE),
                ),
            ),
        )
        self.db.create_index("ip_prefixbookmark", ["user_id", "prefix_id"], unique=True)
