# ---------------------------------------------------------------------
# DatabaseStorage
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party models
# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.model.databasestorage import DatabaseStorage as DBS
from noc.core.model.fields import BinaryField


class DatabaseStorage(NOCModel):
    """
    Database Storage

    Attributes:
        name: Name
        data: Data
        size: Size
        mtime: MTime
    """

    class Meta:
        app_label = "main"
        db_table = "main_databasestorage"
        verbose_name = "Database Storage"
        verbose_name_plural = "Database Storage"

    name = models.CharField(max_length=256, unique=True)
    data = BinaryField()
    size = models.IntegerField()
    mtime = models.DateTimeField()

    # Options for DatabaseStorage

    @classmethod
    def dbs_options(cls):
        return {
            "db_table": DatabaseStorage._meta.db_table,
            "name_field": "name",
            "data_field": "data",
            "mtime_field": "mtime",
            "size_field": "size",
        }

    @classmethod
    def get_dbs(cls):
        """
        Get DatabaseStorage instance
        """
        return DBS(cls.dbs_options())


# Default database storage
database_storage = DatabaseStorage.get_dbs()
