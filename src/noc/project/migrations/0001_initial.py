# ---------------------------------------------------------------------
# Project module models
# ---------------------------------------------------------------------
# Copyright (C) 2007-2013 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.migration.base import BaseMigration


class Migration(BaseMigration):
    def migrate(self) -> None:
        self.db.create_table(
            "project_project",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("code", models.CharField(max_length=256, unique=True)),
                ("name", models.CharField(max_length=256)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )
