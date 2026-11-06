# ----------------------------------------------------------------------
# event correlation rule
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
        self.db.delete_table("fm_eventcorrelationrule")

        # Model 'EventCorrelationRule'
        self.db.create_table(
            "fm_eventcorrelationrule",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("description", models.TextField(null=True, blank=True)),
                ("is_builtin", models.BooleanField(default=False)),
                (
                    "rule_type",
                    models.CharField(max_length=32, choices=[("Pair", "Pair")]),
                ),
                (
                    "action",
                    models.CharField(
                        max_length=1,
                        choices=[
                            ("C", "Close"),
                            ("D", "Drop"),
                            ("P", "Root (parent)"),
                            ("c", "Root (child)"),
                        ],
                    ),
                ),
                ("same_object", models.BooleanField(default=True)),
                ("window", models.IntegerField(default=0)),
            ),
        )

        # Mock Models
        EventCorrelationRule = self.db.mock_model(
            model_name="EventCorrelationRule", db_table="fm_eventcorrelationrule"
        )
        EventClass = self.db.mock_model(model_name="EventClass", db_table="fm_eventclass")

        # Model 'EventCorrelationMatchedClass'
        self.db.create_table(
            "fm_eventcorrelationmatchedclass",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "rule",
                    models.ForeignKey(EventCorrelationRule, on_delete=models.CASCADE),
                ),
                (
                    "event_class",
                    models.ForeignKey(EventClass, on_delete=models.CASCADE),
                ),
            ),
        )
        self.db.create_index(
            "fm_eventcorrelationmatchedclass", ["rule_id", "event_class_id"], unique=True
        )

        # Mock Models
        EventCorrelationRule = self.db.mock_model(
            model_name="EventCorrelationRule", db_table="fm_eventcorrelationrule"
        )

        # Model 'EventCorrelationMatchedVar'
        self.db.create_table(
            "fm_eventcorrelationmatchedvar",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "rule",
                    models.ForeignKey(EventCorrelationRule, on_delete=models.CASCADE),
                ),
                ("var", models.CharField(max_length=256)),
            ),
        )
        self.db.create_index("fm_eventcorrelationmatchedvar", ["rule_id", "var"], unique=True)
