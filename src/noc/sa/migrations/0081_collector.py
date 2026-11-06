# ----------------------------------------------------------------------
# collector
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
        # Model "Collector"
        self.db.create_table(
            "sa_collector",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )
