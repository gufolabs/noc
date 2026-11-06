# ----------------------------------------------------------------------
# Changes model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateTimeField,
    StringField,
)
from noc.core.clickhouse.model import Model


class Changes(Model):
    """
    Attributes:
        change_id: Id
    """

    class Meta:
        db_table = "changes"
        engine = MergeTree("timestamp", ("user", "model_name"))

    change_id = StringField()
    timestamp = DateTimeField(description="Timestamp")
    user = StringField(description="User")
    model_name = StringField(description="Model Name")
    object_id = StringField(description="Object ID")
    object_name = StringField(description="Object Name")
    op = StringField(description="Operation")
    changes = StringField(description="Changes Details")

    @classmethod
    def transform_query(cls, query, user):
        return query
