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
        timestamp: Timestamp
        user: User
        model_name: Model Name
        object_id: Object ID
        object_name: Object Name
        op: Operation
        changes: Changes Details
    """

    class Meta:
        db_table = "changes"
        engine = MergeTree("timestamp", ("user", "model_name"))

    change_id = StringField()
    timestamp = DateTimeField()
    user = StringField()
    model_name = StringField()
    object_id = StringField()
    object_name = StringField()
    op = StringField()
    changes = StringField()

    @classmethod
    def transform_query(cls, query, user):
        return query
