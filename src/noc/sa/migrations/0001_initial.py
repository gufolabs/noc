# ----------------------------------------------------------------------
# initial
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
        # Model 'Task'
        self.db.create_table(
            "sa_task",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("task_id", models.IntegerField(unique=True)),
                ("start_time", models.DateTimeField(auto_now_add=True)),
                ("end_time", models.DateTimeField()),
                ("profile_name", models.CharField(max_length=64)),
                ("stream_url", models.CharField(max_length=128)),
                ("action", models.CharField(max_length=64)),
                ("args", models.TextField()),
                (
                    "status",
                    models.CharField(
                        max_length=1,
                        choices=[
                            ("n", "New"),
                            ("p", "In Progress"),
                            ("f", "Failure"),
                            ("c", "Complete"),
                        ],
                    ),
                ),
                ("out", models.TextField()),
            ),
        )
