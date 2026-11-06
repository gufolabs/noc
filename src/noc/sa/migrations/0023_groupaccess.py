# ----------------------------------------------------------------------
# group access
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
        # Adding model 'GroupAccess'
        Group = self.db.mock_model(model_name="Group", db_table="auth_group")
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )
        self.db.create_table(
            "sa_groupaccess",
            (
                ("id", models.AutoField(primary_key=True)),
                ("group", models.ForeignKey(Group, on_delete=models.CASCADE)),
                (
                    "selector",
                    models.ForeignKey(
                        ManagedObjectSelector,
                        on_delete=models.CASCADE,
                    ),
                ),
            ),
        )
