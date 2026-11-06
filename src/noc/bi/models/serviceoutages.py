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
        date: Date
        ts: Created
        service: Service BI ID
        service_id: Service Object ID
        from_status: Oper Status on start interval
        to_status: Oper Status on end interval
        affected: Factors Affected to Service Status
        in_maintenance: Service In Maintenance State
    """

    class Meta:
        db_table = "serviceoutages"
        engine = MergeTree("date", ("date", "service"))

    date = DateField()
    ts = DateTimeField()
    # Service ID
    service = UInt64Field()
    service_id = StringField()

    # Outage
    start = DateTimeField()
    stop = DateTimeField()

    from_status = UInt8Field()
    to_status = UInt8Field()
    affected = StringField()
    in_maintenance = UInt8Field()

    final_register = BooleanField()
    administrative_domain = ReferenceField(AdministrativeDomain)
