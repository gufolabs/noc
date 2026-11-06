# ----------------------------------------------------------------------
# databasestorage
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.model.fields import BinaryField


class Migration(BaseMigration):
    def migrate(self) -> None:
        # Model 'DatabaseStorage'
        self.db.create_table(
            "main_databasestorage",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=256, unique=True)),
                ("data", BinaryField()),
                ("size", models.IntegerField()),
                ("mtime", models.DateTimeField()),
            ),
        )
