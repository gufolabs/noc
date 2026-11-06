# ---------------------------------------------------------------------
# Custom Field Enums
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
        # CustomFieldEnumGroup
        self.db.create_table(
            "main_customfieldenumgroup",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=128, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )
        # CustomFieldEnumValue
        CustomFieldEnumGroup = self.db.mock_model(
            model_name="CustomFieldEnumGroup", db_table="main_customfieldenumgroup"
        )

        self.db.create_table(
            "main_customfieldenumvalue",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "enum_group",
                    models.ForeignKey(CustomFieldEnumGroup, on_delete=models.CASCADE),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("key", models.CharField(max_length=256)),
                ("value", models.CharField(max_length=256)),
            ),
        )
        # CustomField.enum_group
        self.db.add_column(
            "main_customfield",
            "enum_group",
            models.ForeignKey(
                CustomFieldEnumGroup,
                null=True,
                blank=True,
                on_delete=models.CASCADE,
            ),
        )
