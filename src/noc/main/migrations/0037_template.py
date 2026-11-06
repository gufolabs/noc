# ----------------------------------------------------------------------
# template
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
        self.db.create_table(
            "main_template",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(unique=True, max_length=128)),
                ("subject", models.TextField()),
                ("body", models.TextField()),
            ),
        )

        Template = self.db.mock_model(model_name="Template", db_table="main_template")

        self.db.create_table(
            "main_systemtemplate",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("description", models.TextField(null=True, blank=True)),
                (
                    "template",
                    models.ForeignKey(Template, on_delete=models.CASCADE),
                ),
            ),
        )
