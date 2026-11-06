# ----------------------------------------------------------------------
# command snippet
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.model.fields import AutoCompleteTagsField


class Migration(BaseMigration):
    def migrate(self) -> None:
        # Mock models
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )

        # Model "ReduceTask"
        self.db.create_table(
            "sa_commandsnippet",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=128, unique=True)),
                ("description", models.TextField()),
                ("snippet", models.TextField()),
                (
                    "change_configuration",
                    models.BooleanField(default=False),
                ),
                (
                    "selector",
                    models.ForeignKey(
                        ManagedObjectSelector,
                        on_delete=models.CASCADE,
                    ),
                ),
                ("is_enabled", models.BooleanField(default=True)),
                ("timeout", models.IntegerField(default=60)),
                ("tags", AutoCompleteTagsField(null=True, blank=True)),
            ),
        )
