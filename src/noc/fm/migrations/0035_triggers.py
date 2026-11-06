# ----------------------------------------------------------------------
# triggers
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    depends_on = [("main", "0037_template")]

    def migrate(self) -> None:
        Template = self.db.mock_model(model_name="Template", db_table="main_template")

        TimePattern = self.db.mock_model(model_name="TimePattern", db_table="main_timepattern")

        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )

        NotificationGroup = self.db.mock_model(
            model_name="NotificationGroup", db_table="main_notificationgroup"
        )

        PyRule = self.db.mock_model(model_name="PyRule", db_table="main_pyrule")

        self.db.create_table(
            "fm_eventtrigger",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("is_enabled", models.BooleanField(default=True)),
                ("event_class_re", models.CharField(max_length=256)),
                ("condition", models.CharField(max_length=256, default="True")),
                (
                    "time_pattern",
                    models.ForeignKey(
                        TimePattern,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "selector",
                    models.ForeignKey(
                        ManagedObjectSelector,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "notification_group",
                    models.ForeignKey(
                        NotificationGroup,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "template",
                    models.ForeignKey(
                        Template,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "pyrule",
                    models.ForeignKey(
                        PyRule,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
            ),
        )

        self.db.create_table(
            "fm_alarmtrigger",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("is_enabled", models.BooleanField(default=True)),
                ("alarm_class_re", models.CharField(max_length=256)),
                ("condition", models.CharField(max_length=256, default="True")),
                (
                    "time_pattern",
                    models.ForeignKey(
                        TimePattern,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "selector",
                    models.ForeignKey(
                        ManagedObjectSelector,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "notification_group",
                    models.ForeignKey(
                        NotificationGroup,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "template",
                    models.ForeignKey(
                        Template,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "pyrule",
                    models.ForeignKey(
                        PyRule,
                        null=True,
                        blank=True,
                        on_delete=models.CASCADE,
                    ),
                ),
            ),
        )
