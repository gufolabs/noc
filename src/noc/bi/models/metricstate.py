# ----------------------------------------------------------------------
# Metrics Log
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.clickhouse.engines import ReplacingMergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    Int16Field,
    StringField,
)
from noc.core.clickhouse.model import Model


class MetricState(Model):
    """
    Attributes:
        date: Date
        ts: Log Updated
        node_id: Node Id
        node_type: Node Type
        slot: Slot number
        state: Node state
    """

    class Meta:
        db_table = "metricstate"
        engine = ReplacingMergeTree("date", ("node_id",))

    date = DateField()
    ts = DateTimeField()
    node_id = StringField()
    node_type = StringField(low_cardinality=True)
    slot = Int16Field()
    state = StringField()
