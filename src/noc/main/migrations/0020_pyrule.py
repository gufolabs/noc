# ----------------------------------------------------------------------
# pyrule
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
        # Adding model 'PyRule'
        self.db.create_table(
            "main_pyrule",
            (
                ("id", models.AutoField(primary_key=True)),
                ("name", models.CharField(unique=True, max_length=64)),
                ("interface", models.CharField(max_length=64)),
                ("description", models.TextField()),
                ("text", models.TextField()),
                ("changed", models.DateTimeField(auto_now=True, auto_now_add=True)),
            ),
        )
