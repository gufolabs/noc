# ----------------------------------------------------------------------
# managed object
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
        # Model 'AdministrativeDomain'
        self.db.create_table(
            "sa_administrativedomain",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=32, unique=True)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )
        # Model 'ObjectGroup'
        self.db.create_table(
            "sa_objectgroup",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=32, unique=True)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )

        # Mock Models
        AdministrativeDomain = self.db.mock_model(
            model_name="AdministrativeDomain", db_table="sa_administrativedomain"
        )
        Activator = self.db.mock_model(model_name="Activator", db_table="sa_activator")
        self.db.create_table(
            "sa_managedobject",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("is_managed", models.BooleanField(default=True)),
                (
                    "administrative_domain",
                    models.ForeignKey(
                        AdministrativeDomain,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "activator",
                    models.ForeignKey(Activator, on_delete=models.CASCADE),
                ),
                ("profile_name", models.CharField(max_length=128)),
                ("scheme", models.IntegerField()),
                ("address", models.CharField(max_length=64)),
                ("port", models.PositiveIntegerField(blank=True, null=True)),
                ("user", models.CharField(max_length=32, blank=True, null=True)),
                ("password", models.CharField(max_length=32, blank=True, null=True)),
                (
                    "super_password",
                    models.CharField(max_length=32, blank=True, null=True),
                ),
                ("remote_path", models.CharField(max_length=32, blank=True, null=True)),
                (
                    "trap_source_ip",
                    models.GenericIPAddressField(null=True, protocol="IPv4"),
                ),
                (
                    "trap_community",
                    models.CharField(blank=True, null=True, max_length=64),
                ),
                (
                    "is_configuration_managed",
                    models.BooleanField(default=True),
                ),
                ("repo_path", models.CharField(max_length=128, blank=True, null=True)),
            ),
        )
        # Mock Models
        ManagedObject = self.db.mock_model(model_name="ManagedObject", db_table="sa_managedobject")
        ObjectGroup = self.db.mock_model(model_name="ObjectGroup", db_table="sa_objectgroup")

        # M2M field 'ManagedObject.groups'
        self.db.create_table(
            "sa_managedobject_groups",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "managedobject",
                    models.ForeignKey(ManagedObject, null=False, on_delete=models.CASCADE),
                ),
                (
                    "objectgroup",
                    models.ForeignKey(ObjectGroup, null=False, on_delete=models.CASCADE),
                ),
            ),
        )

        # Mock Models
        User = self.db.mock_model(model_name="User", db_table="auth_user")
        AdministrativeDomain = self.db.mock_model(
            model_name="AdministrativeDomain", db_table="sa_administrativedomain"
        )
        ObjectGroup = self.db.mock_model(model_name="ObjectGroup", db_table="sa_objectgroup")

        # Model 'UserAccess'
        self.db.create_table(
            "sa_useraccess",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("user", models.ForeignKey(User, on_delete=models.CASCADE)),
                (
                    "administrative_domain",
                    models.ForeignKey(
                        AdministrativeDomain,
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        ObjectGroup,
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
            ),
        )
