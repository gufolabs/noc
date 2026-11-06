# ----------------------------------------------------------------------
# split object
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.script.scheme import SCHEME_CHOICES


class Migration(BaseMigration):
    depends_on = [("sa", "0005_activator")]

    def migrate(self) -> None:
        Activator = self.db.mock_model(model_name="Activator", db_table="sa_activator")

        # Model "Config"
        self.db.create_table(
            "cm_config",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("repo_path", models.CharField(max_length=128, unique=True)),
                (
                    "push_every",
                    models.PositiveIntegerField(default=86400, blank=True, null=True),
                ),
                ("next_push", models.DateTimeField(blank=True, null=True)),
                ("last_push", models.DateTimeField(blank=True, null=True)),
                (
                    "pull_every",
                    models.PositiveIntegerField(default=86400, blank=True, null=True),
                ),
                ("next_pull", models.DateTimeField(blank=True, null=True)),
                ("last_pull", models.DateTimeField(blank=True, null=True)),
                (
                    "activator",
                    models.ForeignKey(Activator, on_delete=models.CASCADE),
                ),
                ("profile_name", models.CharField(max_length=128)),
                ("scheme", models.IntegerField(choices=SCHEME_CHOICES)),
                ("address", models.CharField(max_length=64)),
                ("port", models.PositiveIntegerField(blank=True, null=True)),
                ("user", models.CharField(max_length=32, blank=True, null=True)),
                ("password", models.CharField(max_length=32, blank=True, null=True)),
                (
                    "super_password",
                    models.CharField(max_length=32, blank=True, null=True),
                ),
                ("remote_path", models.CharField(max_length=32, blank=True, null=True)),
            ),
        )
        # Mock Models
        Config = self.db.mock_model(model_name="Config", db_table="cm_config")
        ObjectCategory = self.db.mock_model(
            model_name="ObjectCategory", db_table="cm_objectcategory"
        )

        # M2M field "Config.categories"
        self.db.create_table(
            "cm_config_categories",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("config", models.ForeignKey(Config, null=False, on_delete=models.CASCADE)),
                (
                    "objectcategory",
                    models.ForeignKey(ObjectCategory, null=False, on_delete=models.CASCADE),
                ),
            ),
        )
        # Model "PrefixList"
        self.db.create_table(
            "cm_prefixlist",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("repo_path", models.CharField(max_length=128, unique=True)),
                (
                    "push_every",
                    models.PositiveIntegerField(default=86400, blank=True, null=True),
                ),
                ("next_push", models.DateTimeField(blank=True, null=True)),
                ("last_push", models.DateTimeField(blank=True, null=True)),
                (
                    "pull_every",
                    models.PositiveIntegerField(default=86400, blank=True, null=True),
                ),
                ("next_pull", models.DateTimeField(blank=True, null=True)),
                ("last_pull", models.DateTimeField(blank=True, null=True)),
            ),
        )
        # Mock Models
        PrefixList = self.db.mock_model(model_name="PrefixList", db_table="cm_prefixlist")
        ObjectCategory = self.db.mock_model(
            model_name="ObjectCategory", db_table="cm_objectcategory"
        )

        # M2M field "PrefixList.categories"
        self.db.create_table(
            "cm_prefixlist_categories",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("prefixlist", models.ForeignKey(PrefixList, null=False, on_delete=models.CASCADE)),
                (
                    "objectcategory",
                    models.ForeignKey(ObjectCategory, null=False, on_delete=models.CASCADE),
                ),
            ),
        )
        # Model "DNS"
        self.db.create_table(
            "cm_dns",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("repo_path", models.CharField(max_length=128, unique=True)),
                (
                    "push_every",
                    models.PositiveIntegerField(default=86400, blank=True, null=True),
                ),
                ("next_push", models.DateTimeField(blank=True, null=True)),
                ("last_push", models.DateTimeField(blank=True, null=True)),
                (
                    "pull_every",
                    models.PositiveIntegerField(default=86400, blank=True, null=True),
                ),
                ("next_pull", models.DateTimeField(blank=True, null=True)),
                ("last_pull", models.DateTimeField(blank=True, null=True)),
            ),
        )
        # Mock Models
        DNS = self.db.mock_model(
            model_name="DNS", db_table="cm_dns", pk_field_name="id", pk_field_type=models.AutoField
        )
        ObjectCategory = self.db.mock_model(
            model_name="ObjectCategory",
            db_table="cm_objectcategory",
            pk_field_name="id",
            pk_field_type=models.AutoField,
        )

        # M2M field "DNS.categories"
        self.db.create_table(
            "cm_dns_categories",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("dns", models.ForeignKey(DNS, null=False, on_delete=models.CASCADE)),
                (
                    "objectcategory",
                    models.ForeignKey(ObjectCategory, null=False, on_delete=models.CASCADE),
                ),
            ),
        )
