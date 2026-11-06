# ---------------------------------------------------------------------
# Create sa_objectnotification table
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
        # Mock Models
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )
        NotificationGroup = self.db.mock_model(
            model_name="NotificationGroup", db_table="main_notificationgroup"
        )
        # Model "Activator"
        self.db.create_table(
            "sa_objectnotification",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("selector", models.ForeignKey(ManagedObjectSelector, on_delete=models.CASCADE)),
                (
                    "notification_group",
                    models.ForeignKey(NotificationGroup, on_delete=models.CASCADE),
                ),
                # Events
                ("config_changed", models.BooleanField()),
                ("alarm_risen", models.BooleanField()),
                ("alarm_cleared", models.BooleanField()),
                ("alarm_commented", models.BooleanField()),
                ("new", models.BooleanField()),
                ("deleted", models.BooleanField()),
                ("version_changed", models.BooleanField()),
                ("interface_changed", models.BooleanField()),
                ("script_failed", models.BooleanField()),
                ("config_policy_violation", models.BooleanField()),
            ),
        )
