# ----------------------------------------------------------------------
# notifications
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
        # Model 'NotificationGroup'
        self.db.create_table(
            "main_notificationgroup",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )

        # Mock Models
        NotificationGroup = self.db.mock_model(
            model_name="NotificationGroup", db_table="main_notificationgroup"
        )
        TimePattern = self.db.mock_model(model_name="TimePattern", db_table="main_timepattern")
        User = self.db.mock_model(model_name="User", db_table="auth_user")

        # Model 'NotificationGroupUser'
        self.db.create_table(
            "main_notificationgroupuser",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "notification_group",
                    models.ForeignKey(
                        NotificationGroup,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "time_pattern",
                    models.ForeignKey(TimePattern, on_delete=models.CASCADE),
                ),
                ("user", models.ForeignKey(User, on_delete=models.CASCADE)),
            ),
        )
        self.db.create_index(
            "main_notificationgroupuser",
            ["notification_group_id", "time_pattern_id", "user_id"],
            unique=True,
        )

        # Mock Models
        NotificationGroup = self.db.mock_model(
            model_name="NotificationGroup", db_table="main_notificationgroup"
        )
        TimePattern = self.db.mock_model(model_name="TimePattern", db_table="main_timepattern")

        # Model 'NotificationGroupOther'
        self.db.create_table(
            "main_notificationgroupother",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "notification_group",
                    models.ForeignKey(
                        NotificationGroup,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "time_pattern",
                    models.ForeignKey(TimePattern, on_delete=models.CASCADE),
                ),
                ("notification_method", models.CharField(max_length=16)),
                ("params", models.CharField(max_length=256)),
            ),
        )
        self.db.create_index(
            "main_notificationgroupother",
            ["notification_group_id", "time_pattern_id", "notification_method", "params"],
            unique=True,
        )

        # Model 'Notification'
        self.db.create_table(
            "main_notification",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("timestamp", models.DateTimeField(auto_now=True, auto_now_add=True)),
                ("notification_method", models.CharField(max_length=16)),
                ("notification_params", models.CharField(max_length=256)),
                ("subject", models.CharField(max_length=256)),
                ("body", models.TextField()),
                ("next_try", models.DateTimeField(null=True, blank=True)),
                ("actual_till", models.DateTimeField(null=True, blank=True)),
            ),
        )
