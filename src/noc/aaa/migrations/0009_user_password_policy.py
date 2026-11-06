# ----------------------------------------------------------------------
# User password policy fields
# ----------------------------------------------------------------------
# Copyright (C) 2007-2024 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.contrib.postgres.fields import ArrayField
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    def migrate(self) -> None:
        self.db.add_column(
            "auth_user",
            "change_at",
            models.DateTimeField(blank=True, null=True),
        )
        self.db.add_column(
            "auth_user",
            "valid_from",
            models.DateTimeField(blank=True, null=True),
        )
        self.db.add_column(
            "auth_user",
            "valid_until",
            models.DateTimeField(blank=True, null=True),
        )
        self.db.add_column(
            "auth_user",
            "password_history",
            ArrayField(models.CharField(max_length=128), blank=True, null=True),
        )
