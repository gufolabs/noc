# ----------------------------------------------------------------------
# Diagnostic History model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.bi.dictionaries.objectdiagnosticconfig import ObjectDiagnosticConfig
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    DateField,
    DateTimeField,
    ReferenceField,
    StringField,
)
from noc.core.clickhouse.model import Model


class DiagnosticHistory(Model):
    """
    Attributes:
        date: Date
        ts: Created
        managed_object: Object Name
        diagnostic: Diagnostic Reference
        diagnostic_name: Diagnostic Name
        from_state: From state
        state: Current diagnostic state
        reason: Changed Reason
        data: Collected data (JSON)
    """

    class Meta:
        db_table = "diagnostichistory"
        engine = MergeTree(
            "date", ("date", "diagnostic_name"), primary_keys=("date", "diagnostic_name")
        )

    date = DateField()
    ts = DateTimeField()
    managed_object = ReferenceField(ManagedObject)
    diagnostic = ReferenceField(ObjectDiagnosticConfig)
    diagnostic_name = StringField(low_cardinality=True)
    # agent = ReferenceField(Agent, description=_("Object Name"))
    # service = ReferenceField(ManagedObject, description=_("Object Name"))
    from_state = StringField(low_cardinality=True)
    state = StringField(low_cardinality=True)
    reason = StringField()
    data = StringField()

    @classmethod
    def transform_query(cls, query, user):
        return query
