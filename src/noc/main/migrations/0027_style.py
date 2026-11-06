# ----------------------------------------------------------------------
# style
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
        # Model 'Color'
        self.db.create_table(
            "main_style",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=64, unique=True)),
                ("font_color", models.IntegerField(default=0x000000)),
                ("background_color", models.IntegerField(default=0xFFFFFF)),
                ("bold", models.BooleanField(default=False)),
                ("italic", models.BooleanField(default=False)),
                ("underlined", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("description", models.TextField(null=True, blank=True)),
            ),
        )
