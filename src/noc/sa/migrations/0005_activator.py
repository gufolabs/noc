# ----------------------------------------------------------------------
# activator
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
        # Model 'Activator'
        self.db.create_table(
            "sa_activator",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                ("name", models.CharField(max_length=32, unique=True)),
                ("ip", models.GenericIPAddressField(protocol="IPv4")),
                ("auth", models.CharField(max_length=64)),
                ("is_active", models.BooleanField(default=True)),
            ),
        )
