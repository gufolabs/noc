# ---------------------------------------------------------------------
# Create CustomField
# ---------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    def migrate(self) -> None:
        # ResourceState
        self.db.create_table(
            "main_customfield",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("table", models.CharField(max_length=64)),
                ("name", models.CharField(max_length=64)),
                ("is_active", models.BooleanField(default=True)),
                ("label", models.CharField(max_length=128)),
                (
                    "type",
                    models.CharField(
                        max_length=64, choices=[("str", "String"), ("int", "Integer")]
                    ),
                ),
                ("description", models.TextField(null=True, blank=True)),
                ("max_length", models.IntegerField(default=0)),
                ("regexp", models.CharField(max_length=256, null=True, blank=True)),
                ("is_indexed", models.BooleanField(default=False)),
                ("is_searchable", models.BooleanField(default=False)),
                ("is_filtered", models.BooleanField(default=False)),
            ),
        )
