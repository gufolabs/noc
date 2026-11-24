# ----------------------------------------------------------------------
# Capabilities mixin tests
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from typing import Any

# Third-party modules
import pytest

# NOC modules
from noc.core.caps.mixin import CapsMixin, DjangoCapsMixin, DocumentCapsMixin
from noc.core.caps.types import CapsValue
from noc.core.change.model import ChangeField


def test_mixin_structure() -> None:
    """Both store mixins derive from the common CapsMixin"""
    assert issubclass(DjangoCapsMixin, CapsMixin)
    assert issubclass(DocumentCapsMixin, CapsMixin)
    # Shared functionality lives in the base mixin
    for method in ("get_caps", "set_caps", "reset_caps", "update_caps", "get_caps_config"):
        assert method in vars(CapsMixin), method
    # Store-specific persistence lives in the respective mixins
    for mixin in (DjangoCapsMixin, DocumentCapsMixin):
        assert "iter_caps" in vars(mixin)
        assert "save_caps" in vars(mixin)


def test_caps_mixin_requires_store_implementation() -> None:
    """Bare CapsMixin does not implement store persistence"""
    m = CapsMixin()
    with pytest.raises(NotImplementedError):
        m.iter_caps()
    with pytest.raises(NotImplementedError):
        m.save_caps([])


class MockManagedObject(DjangoCapsMixin):
    name = "mock"

    def __init__(self, caps=None) -> None:
        self.caps = caps or []

    def save_caps(
        self,
        caps: list[CapsValue],
        dry_run: bool = False,
        bulk: Any | None = None,
        changed_fields: list[ChangeField] | None = None,
    ) -> None:
        self.caps = [
            {
                "capability": str(c.capability.pk),
                "value": c.value,
                "source": c.source.value,
                "scope": c.scope or "",
            }
            for c in caps
        ]


def get_object_caps_mock() -> MockManagedObject:
    """Prepare ManagedObject for mock"""
    # Send error/send success
    return MockManagedObject()


@pytest.fixture
def object_caps():
    return get_object_caps_mock()


@pytest.mark.parametrize(
    ("caps", "update_caps", "expected"),
    [
        ([], {"Cisco | IP | SLA | Probes": 1}, {"Cisco | IP | SLA | Probes": 1}),
        (
            [
                {"key": "Cisco | IP | SLA | Responder", "value": False, "source": "discovery"},
                {
                    "key": "Cisco | IP | SLA | Responder",
                    "value": True,
                    "source": "etl",
                    "scope": "RM",
                },
            ],
            {"Cisco | IP | SLA | Probes": 1},
            {"Cisco | IP | SLA | Probes": 1, "Cisco | IP | SLA | Responder": False},
        ),
    ],
)
def test_update_caps(caps, update_caps: dict[str, int], expected, object_caps) -> None:
    for c in caps:
        object_caps.set_caps(**c)
    object_caps.update_caps(update_caps, source="manual")
    assert object_caps.get_caps() == expected


def test_update_caps_scopes(object_caps) -> None:
    object_caps.update_caps({"Cisco | IP | SLA | Probes": 1}, source="manual", scope="scope1")
    object_caps.update_caps({"Cisco | IP | SLA | Probes": 22}, source="manual", scope="scope2")
    assert len(list(object_caps.iter_caps())) == 2
    assert object_caps.get_caps() == {"Cisco | IP | SLA | Probes": 1}


@pytest.mark.parametrize(
    ("caps", "update_caps", "expected"),
    [
        (
            [
                {
                    "key": "Cisco | IP | SLA | Probes",
                    "value": 2,
                    "source": "database",
                    "scope": "sla",
                },
                {
                    "key": "Chassis | Serial Number",
                    "value": "xxxx",
                    "source": "etl",
                    "scope": "RM",
                },
            ],
            {"key": "DB | Interfaces", "value": 1},
            {
                "Cisco | IP | SLA | Probes": 2,
                "Chassis | Serial Number": "xxxx",
            },
        ),
    ],
)
def test_delete_caps(caps, update_caps, expected, object_caps) -> None:
    for c in caps:
        object_caps.set_caps(**c)
    object_caps.update_caps(update_caps, source="database")
    assert object_caps.get_caps() == expected


def test_set_caps(object_caps) -> None:
    for _ in range(1, 4):
        object_caps.set_caps("DB | Interfaces", 1)
    assert len(object_caps.caps) == 1
    for _ in range(1, 4):
        object_caps.set_caps("CPE | Vendor", "Test1")
    assert len(object_caps.caps) == 2
    object_caps.set_caps("CPE | Vendor", "Test1", scope="New")
    for _ in range(1, 4):
        object_caps.set_caps("CPE | Vendor", "Test1", scope=None)
    assert len(object_caps.caps) == 3


@pytest.mark.parametrize(
    ("caps", "update_caps", "scope", "expected_scope", "expected"),
    [
        (
            [],
            {"Cisco | IP | SLA | Probes": 1},
            None,
            {"Cisco | IP | SLA | Probes": 1},
            {"Cisco | IP | SLA | Probes": 1},
        ),
        (
            [
                {"key": "Cisco | IP | SLA | Responder", "value": False, "source": "discovery"},
                {
                    "key": "Cisco | IP | SLA | Responder",
                    "value": True,
                    "source": "etl",
                    "scope": "RM",
                },
            ],
            {"Cisco | IP | SLA | Probes": 1},
            "RM",
            {"Cisco | IP | SLA | Probes": 1, "Cisco | IP | SLA | Responder": True},
            {"Cisco | IP | SLA | Probes": 1, "Cisco | IP | SLA | Responder": False},
        ),
    ],
)
def test_get_scope_caps(
    caps, update_caps: dict[str, int], scope, expected_scope, expected, object_caps
) -> None:
    for c in caps:
        object_caps.set_caps(**c)
    object_caps.update_caps(update_caps, source="manual", scope=scope)
    assert object_caps.get_caps(scope=scope) == expected_scope
    assert object_caps.get_caps() == expected
