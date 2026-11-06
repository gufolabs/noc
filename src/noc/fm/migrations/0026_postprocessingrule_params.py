# ----------------------------------------------------------------------
# postprocessing rule params
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    depends_on = [("main", "0015_notification_link"), ("sa", "0015_managedobjectselector")]

    def migrate(self) -> None:
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )
        TimePattern = self.db.mock_model(model_name="TimePattern", db_table="main_timepattern")
        NotificationGroup = self.db.mock_model(
            model_name="NotificationGroup", db_table="main_notificationgroup"
        )

        self.db.add_column(
            "fm_eventpostprocessingrule",
            "managed_object_selector",
            models.ForeignKey(
                ManagedObjectSelector,
                null=True,
                blank=True,
                on_delete=models.CASCADE,
            ),
        )
        self.db.add_column(
            "fm_eventpostprocessingrule",
            "time_pattern",
            models.ForeignKey(
                TimePattern,
                null=True,
                blank=True,
                on_delete=models.CASCADE,
            ),
        )
        self.db.add_column(
            "fm_eventpostprocessingrule",
            "notification_group",
            models.ForeignKey(
                NotificationGroup,
                null=True,
                blank=True,
                on_delete=models.CASCADE,
            ),
        )
