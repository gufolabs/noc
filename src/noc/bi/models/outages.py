# ----------------------------------------------------------------------
# Outages model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.bi.dictionaries.administrativedomain import AdministrativeDomain
from noc.core.bi.dictionaries.managedobject import ManagedObject
from noc.core.clickhouse.engines import MergeTree
from noc.core.clickhouse.fields import (
    BooleanField,
    DateField,
    DateTimeField,
    ReferenceField,
)
from noc.core.clickhouse.model import Model
from noc.sa.models.administrativedomain import AdministrativeDomain as AdministrativeDomainM
from noc.sa.models.useraccess import UserAccess


class Outages(Model):
    """
    Attributes:
        date: Date
        ts: Register
        managed_object: Object Name
        start: Start Outage
        stop: End Outage
        final_register: End Outage Register
        administrative_domain: Admin. Domain
    """

    class Meta:
        db_table = "outages"
        engine = MergeTree(
            "date", ("start", "managed_object"), primary_keys=("start", "managed_object")
        )

    date = DateField()
    ts = DateTimeField()
    managed_object = ReferenceField(ManagedObject)
    start = DateTimeField()
    stop = DateTimeField()  # None for active outages
    final_register = BooleanField()
    administrative_domain = ReferenceField(AdministrativeDomain)

    @classmethod
    def transform_query(cls, query, user):
        if not user or user.is_superuser:
            return query  # No restrictions
        # Get user domains
        domains = UserAccess.get_domains(user)
        # Resolve domains against dict
        domain_ids = [x.bi_id for x in AdministrativeDomainM.objects.filter(id__in=domains)]
        filter = query.get("filter", {})
        dl = len(domain_ids)
        if not dl:
            return None
        if dl == 1:
            q = {"$eq": [{"$field": "administrative_domain"}, domain_ids[0]]}
        else:
            q = {"$in": [{"$field": "administrative_domain"}, domain_ids]}
        if filter:
            query["filter"] = {"$and": [query["filter"], q]}
        else:
            query["filter"] = q
        return query
