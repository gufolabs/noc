# ----------------------------------------------------------------------
# selector by attribute
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
        # Adding field 'UserAccess.selector'
        ManagedObjectSelector = self.db.mock_model(
            model_name="ManagedObjectSelector", db_table="sa_managedobjectselector"
        )
        self.db.create_table(
            "sa_managedobjectselectorbyattribute",
            (
                ("id", models.AutoField(primary_key=True, auto_created=True)),
                (
                    "selector",
                    models.ForeignKey(
                        ManagedObjectSelector,
                        on_delete=models.CASCADE,
                    ),
                ),
                ("key_re", models.CharField(max_length=256)),
                ("value_re", models.CharField(max_length=256)),
            ),
        )
