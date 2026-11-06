# ----------------------------------------------------------------------
# ReportExecutionHistory Model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2017 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    BooleanField,
    DateField,
    DateTimeField,
    StringField,
    UInt32Field,
)
from noc.core.clickhouse.model import Model


class ReportExecutionHistory(Model):
    """
    Attributes:
        start: Start execution time
        end: End execution time
        duration: Execute duration
        report: Report UUID
        name: Report Name
        code: Report Code
        user: Requesting User
        output_document: Link to output document
        successfully: Successful execute
        canceled: Report was cancelled
        params: Report Params
        error: Execution error
    """

    class Meta:
        db_table = "reportexecutionhistory"
        engine = MergeTree("date", ("date", "report"))

    date = DateField()
    start = DateTimeField()
    end = DateTimeField()
    duration = UInt32Field()
    report = StringField()
    name = StringField()
    code = StringField()
    user = StringField()
    output_document = StringField()
    successfully = BooleanField()
    canceled = BooleanField()
    params = StringField()
    error = StringField()
    process_id = StringField("Process endpoint")
