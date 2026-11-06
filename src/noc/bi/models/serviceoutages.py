# ----------------------------------------------------------------------
# ServiceOutages model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.administrativedomain import AdministrativeDomain
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    BooleanField,
    DateField,
    DateTimeField,
    ReferenceField,
    StringField,
    UInt8Field,
    UInt64Field,
)
from noc.core.clickhouse.model import Model


class ServiceOutages(Model):
    """
    Attributes:
        start: Start Outage
        stop: End Outage
        final_register: End Outage Register (Service admin state to non-production)
        administrative_domain: Admin. Domain
    """

    class Meta:
        db_table = "serviceoutages"
        engine = MergeTree("date", ("date", "service"))

    date = DateField(description="Date")
    ts = DateTimeField(description="Created")
    # Service ID
    service = UInt64Field(description="Service BI ID")
    service_id = StringField(description="Service Object ID")

    # Outage
    start = DateTimeField()
    stop = DateTimeField()

    from_status = UInt8Field(description="Oper Status on start interval")
    to_status = UInt8Field(description="Oper Status on end interval")
    affected = StringField(description="Factors Affected to Service Status")
    in_maintenance = UInt8Field(description="Service In Maintenance State")

    final_register = BooleanField()
    administrative_domain = ReferenceField(AdministrativeDomain)
