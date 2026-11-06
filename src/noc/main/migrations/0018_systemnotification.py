# ----------------------------------------------------------------------
# systemnotification
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
        NotificationGroup = self.db.mock_model(
            model_name="NotificationGroup", db_table="main_notificationgroup"
        )

        # Adding model 'SystemNotification'
        self.db.create_table(
            "main_systemnotification",
            (
                (
                    "notification_group",
                    models.ForeignKey(
                        NotificationGroup,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                ("id", models.AutoField(primary_key=True)),
                ("name", models.CharField(unique=True, max_length=64)),
            ),
        )
