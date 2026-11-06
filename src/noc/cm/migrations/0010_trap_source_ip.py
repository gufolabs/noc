# ----------------------------------------------------------------------
# trap source ip
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
        self.db.add_column(
            "cm_config",
            "trap_source_ip",
            models.GenericIPAddressField(blank=True, null=True, protocol="IPv4"),
        )
        self.db.add_column(
            "cm_config",
            "trap_community",
            models.CharField(blank=True, null=True, max_length=64),
        )
