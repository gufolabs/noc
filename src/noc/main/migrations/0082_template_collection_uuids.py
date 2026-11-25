# ----------------------------------------------------------------------
# Assign collection UUIDs to built-in templates
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.migration.base import BaseMigration

# UUIDs must match collections/main.templates/*.json
COLLECTION_UUIDS = {
    "dns.zone.change": "f2ae3304-e463-4b63-9ff2-383c0b2e5b62",
    "dns.zone.new": "e1525101-e9c0-4b1d-baef-bd4e8bdc4f7e",
    "inv.discovery.address_collision_report": "30c31c2f-0b94-4cf8-b404-c13179c0756b",
    "inv.discovery.interface_status_change": "13b53d1f-ef3f-4969-a068-3398c3a4e047",
    "inv.discovery.new_addresses_report": "c79e5d79-6375-4999-94f0-f6f4dc693ba6",
    "inv.discovery.new_prefixes_report": "010593a4-2403-4386-9aed-9c7114480074",
    "inv.discovery.new_vlans_report": "319a0ea8-1ce6-45de-a36c-a6227828d862",
    "sa.mnaged_object.config_change": "ac712d9b-df24-4d21-9cf1-d8528330c630",
    "sa.mnaged_object.config_policy_violation": "0bc55062-5ff6-4bef-87b5-ea2e2bdc55ba",
    "sa.mnaged_object.delete": "d83e07a9-999e-4954-9340-aed936c9be2e",
    "sa.mnaged_object.new": "9680f3bc-95ce-44e6-b5ce-71783daec237",
    "sa.mnaged_object.version_changed": "51e7dfa6-09ee-4f8d-8f4f-01a3bf6e7ce5",
}


class Migration(BaseMigration):
    def migrate(self) -> None:
        for name, u in COLLECTION_UUIDS.items():
            self.db.execute("UPDATE main_template SET uuid=%s WHERE name=%s", [u, name])
