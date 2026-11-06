# ----------------------------------------------------------------------
# changes quarantine
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
        # Model 'Language'
        self.db.create_table(
            "main_changesquarantine",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                ("changes_type", models.CharField(max_length=64)),
                ("subject", models.CharField(max_length=256)),
                ("data", PickledField()),
            ),
        )

        self.db.create_table(
            "main_changesquarantinerule",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("changes_type", models.CharField(max_length=64)),
                ("subject_re", models.CharField(max_length=256)),
                (
                    "action",
                    models.CharField(
                        max_length=1,
                        choices=[("I", "Ignore"), ("A", "Accept"), ("Q", "Quarantine")],
                    ),
                ),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )
