# ----------------------------------------------------------------------
# schedule
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    depends_on = [("sa", "0003_task_schedule")]

    def migrate(self) -> None:
        # TimePattern
        TimePattern = self.db.mock_model(model_name="TimePattern", db_table="main_timepattern")
        # Model "TaskSchedule"
        self.db.create_table(
            "main_schedule",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("periodic_name", models.CharField(max_length=64)),
                ("is_enabled", models.BooleanField(default=False)),
                (
                    "time_pattern",
                    models.ForeignKey(TimePattern, on_delete=models.CASCADE),
                ),
                ("run_every", models.PositiveIntegerField(default=86400)),
                ("timeout", models.PositiveIntegerField(null=True, blank=True)),
                ("last_run", models.DateTimeField(blank=True, null=True)),
                ("last_status", models.BooleanField(default=True)),
            ),
        )
