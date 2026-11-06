# ----------------------------------------------------------------------
# Span Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    Int32Field,
    MapField,
    StringField,
    UInt32Field,
    UInt64Field,
)
from noc.core.clickhouse.model import Model


class Span(Model):
    """
    Attributes:
        date: Date
        ts: Created
        ctx: Span context
        id: Span id
        parent: Span parent
        server: Called service
        service: Called function
        client: Caller service
        duration: Duration (us)
        sample: Sampling rate
        error_code: Error code
        error_text: Error text
        in_label: Input arguments
        out_label: Output results
        in_headers: Call headers
    """

    class Meta:
        db_table = "span"
        engine = MergeTree(
            "date",
            ("server", "service", "ts", "in_label"),
            primary_keys=("server", "service", "ts", "in_label"),
        )

    date = DateField()
    ts = DateTimeField()
    ctx = UInt64Field()
    id = UInt64Field()
    parent = UInt64Field()
    server = StringField()
    service = StringField()
    client = StringField()
    duration = UInt64Field()
    sample = Int32Field()
    error_code = UInt32Field()
    error_text = StringField()
    in_headers = MapField(StringField())
    in_label = StringField()
    out_label = StringField()

    @classmethod
    def transform_query(cls, query, user):
        return query
