# ----------------------------------------------------------------------
# rpsl
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
        # Model 'RPSL'
        self.db.create_table(
            "cm_rpsl",
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
        RPSL = self.db.mock_model(model_name="RPSL", db_table="cm_rpsl")
        ObjectCategory = self.db.mock_model(
            model_name="ObjectCategory", db_table="cm_objectcategory"
        )

        # M2M field 'RPSL.categories'
        self.db.create_table(
            "cm_rpsl_categories",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("rpsl", models.ForeignKey(RPSL, null=False, on_delete=models.CASCADE)),
                (
                    "objectcategory",
                    models.ForeignKey(ObjectCategory, null=False, on_delete=models.CASCADE),
                ),
            ),
        )
