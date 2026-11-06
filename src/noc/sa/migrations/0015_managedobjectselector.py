# ----------------------------------------------------------------------
# managedobjectselector
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
        # Mock Models
        AdministrativeDomain = self.db.mock_model(
            model_name="AdministrativeDomain", db_table="sa_administrativedomain"
        )

        # Model 'ManagedObjectSelector'
        self.db.create_table(
            "sa_managedobjectselector",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("is_enabled", models.BooleanField(default=True)),
                ("filter_id", models.IntegerField(null=True, blank=True)),
                (
                    "filter_name",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                (
                    "filter_profile",
                    models.CharField(max_length=64, null=True, blank=True),
                ),
                (
                    "filter_address",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                (
                    "filter_administrative_domain",
                    models.ForeignKey(
                        AdministrativeDomain,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "filter_user",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                (
                    "filter_remote_path",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                (
                    "filter_description",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                (
                    "filter_repo_path",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                (
                    "source_combine_method",
                    models.CharField(
                        max_length=1,
                        default="O",
                        choices=[("A", "AND"), ("O", "OR")],
                    ),
                ),
            ),
        )
        # Mock Models
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )
        ObjectGroup = self.db.mock_model(model_name="ObjectGroup", db_table="sa_objectgroup")

        # M2M field 'ManagedObjectSelector.filter_groups'
        self.db.create_table(
            "sa_managedobjectselector_filter_groups",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "managedobjectselector",
                    models.ForeignKey(ManagedObjectSelector, null=False, on_delete=models.CASCADE),
                ),
                (
                    "objectgroup",
                    models.ForeignKey(ObjectGroup, null=False, on_delete=models.CASCADE),
                ),
            ),
        )
        # Mock Models
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )
        self.db.create_table(
            "sa_managedobjectselector_sources",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "from_managedobjectselector",
                    models.ForeignKey(ManagedObjectSelector, null=False, on_delete=models.CASCADE),
                ),
                (
                    "to_managedobjectselector",
                    models.ForeignKey(ManagedObjectSelector, null=False, on_delete=models.CASCADE),
                ),
            ),
        )
