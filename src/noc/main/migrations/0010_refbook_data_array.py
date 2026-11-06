# ----------------------------------------------------------------------
# refbook data array
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.model.fields import TextArrayField


class Migration(BaseMigration):
    def migrate(self) -> None:
        self.db.delete_table("main_refbookdata")

        # Mock Models
        RefBook = self.db.mock_model(model_name="RefBook", db_table="main_refbook")

        # Model 'RefBookData'
        self.db.create_table(
            "main_refbookdata",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "ref_book",
                    models.ForeignKey(RefBook, on_delete=models.CASCADE),
                ),
                ("value", TextArrayField()),
            ),
        )

        self.db.execute("UPDATE main_refbook SET next_update='now'")
