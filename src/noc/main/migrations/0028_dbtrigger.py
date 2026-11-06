# ----------------------------------------------------------------------
# db trigger
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
        PyRule = self.db.mock_model(model_name="PyRule", db_table="main_pyrule")
        self.db.create_table(
            "main_dbtrigger",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("model", models.CharField(max_length=128)),
                ("is_active", models.BooleanField(default=True)),
                ("order", models.IntegerField(default=100)),
                ("description", models.TextField(null=True, blank=True)),
                (
                    "pre_save_rule",
                    models.ForeignKey(
                        PyRule,
                        related_name="dbtrigger_presave_set",
                        limit_choices_to={"interface": "IDBPreSave"},
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "post_save_rule",
                    models.ForeignKey(
                        PyRule,
                        related_name="dbtrigger_postsave_set",
                        limit_choices_to={"interface": "IDBPostSave"},
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "pre_delete_rule",
                    models.ForeignKey(
                        PyRule,
                        related_name="dbtrigger_predelete_set",
                        limit_choices_to={"interface": "IDBPreDelete"},
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "post_delete_rule",
                    models.ForeignKey(
                        PyRule,
                        related_name="dbtrigger_postdelete_set",
                        limit_choices_to={"interface": "IDBPostDelete"},
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
            ),
        )
