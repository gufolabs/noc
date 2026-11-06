# ----------------------------------------------------------------------
# task schedule
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
        # Model 'TaskSchedule'
        self.db.create_table(
            "sa_taskschedule",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("periodic_name", models.CharField(max_length=64)),
                ("is_enabled", models.BooleanField(default=False)),
                ("run_every", models.PositiveIntegerField(default=86400)),
                ("retries", models.PositiveIntegerField(default=1)),
                ("retry_delay", models.PositiveIntegerField(default=60)),
                ("timeout", models.PositiveIntegerField(default=300)),
                ("next_run", models.DateTimeField(auto_now_add=True)),
                ("retries_left", models.PositiveIntegerField(default=1)),
            ),
        )
