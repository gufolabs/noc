# ----------------------------------------------------------------------
# event post processing
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
        # Mock Models
        EventClass = self.db.mock_model(model_name="EventClass", db_table="fm_eventclass")
        EventPriority = self.db.mock_model(model_name="EventPriority", db_table="fm_eventpriority")
        EventCategory = self.db.mock_model(model_name="EventCategory", db_table="fm_eventcategory")

        # Model 'EventPostProcessingRule'
        self.db.create_table(
            "fm_eventpostprocessingrule",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "event_class",
                    models.ForeignKey(EventClass, on_delete=models.CASCADE),
                ),
                ("name", models.CharField(max_length=64)),
                ("preference", models.IntegerField(default=1000)),
                ("is_active", models.BooleanField(default=True)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "change_priority",
                    models.ForeignKey(
                        EventPriority,
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "change_category",
                    models.ForeignKey(
                        EventCategory,
                        blank=True,
                        null=True,
                        on_delete=models.CASCADE,
                    ),
                ),
                (
                    "action",
                    models.CharField(
                        max_length=1,
                        choices=[("A", "Make Active"), ("C", "Close"), ("D", "Drop")],
                        default="A",
                    ),
                ),
            ),
        )

        # Mock Models
        EventPostProcessingRule = self.db.mock_model(
            model_name="EventPostProcessingRule", db_table="fm_eventpostprocessingrule"
        )

        # Model 'EventPostProcessingRE'
        self.db.create_table(
            "fm_eventpostprocessingre",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "rule",
                    models.ForeignKey(
                        EventPostProcessingRule,
                        on_delete=models.CASCADE,
                    ),
                ),
                ("var_re", models.CharField(max_length=256)),
                ("value_re", models.CharField(max_length=256)),
            ),
        )
