# ----------------------------------------------------------------------
# map reduce
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.model.fields import PickledField


class Migration(BaseMigration):
    def migrate(self) -> None:
        # Model 'ReduceTask'
        self.db.create_table(
            "sa_reducetask",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("start_time", models.DateTimeField()),
                ("stop_time", models.DateTimeField()),
                ("reduce_script", models.CharField(max_length=256)),
                ("script_params", PickledField(null=True, blank=True)),
            ),
        )

        # Mock Models
        ReduceTask = self.db.mock_model(model_name="ReduceTask", db_table="sa_reducetask")
        ManagedObject = self.db.mock_model(model_name="ManagedObject", db_table="sa_managedobject")

        # Model 'MapTask'
        self.db.create_table(
            "sa_maptask",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "task",
                    models.ForeignKey(ReduceTask, on_delete=models.CASCADE),
                ),
                (
                    "managed_object",
                    models.ForeignKey(ManagedObject, on_delete=models.CASCADE),
                ),
                ("map_script", models.CharField(max_length=256)),
                ("script_params", PickledField(null=True, blank=True)),
                ("next_try", models.DateTimeField()),
                ("retries_left", models.IntegerField(default=1)),
                (
                    "status",
                    models.CharField(
                        max_length=1,
                        choices=[
                            ("W", "Wait"),
                            ("R", "Running"),
                            ("C", "Complete"),
                            ("F", "Failed"),
                        ],
                        default="W",
                    ),
                ),
                ("script_result", PickledField(null=True, blank=True)),
            ),
        )
