# ----------------------------------------------------------------------
# kb_entry_yattachment
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
        KBEntry = self.db.mock_model(model_name="KBEntry", db_table="kb_kbentry")

        # Model "KBEntryAttachment"
        self.db.create_table(
            "kb_kbentryattachment",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "kb_entry",
                    models.ForeignKey(KBEntry, on_delete=models.CASCADE),
                ),
                ("name", models.CharField(max_length=256)),
                (
                    "description",
                    models.CharField(max_length=256, null=True, blank=True),
                ),
                ("is_hidden", models.BooleanField(default=False)),
                ("file", models.FileField()),
            ),
        )
        self.db.create_index("kb_kbentryattachment", ["kb_entry_id", "name"], unique=True)
