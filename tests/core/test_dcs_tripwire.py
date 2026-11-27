# ---------------------------------------------------------------------
# Test DCS tripwire
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import asyncio

# Third-party modules
import pytest

# NOC modules
from noc.core.dcs.base import DCSBase, DCSTripwireError, dcs


def test_tripwire_initially_off():
    assert not DCSBase.in_tripwire()


def test_enter_exit_tripwire():
    assert not DCSBase.in_tripwire()
    DCSBase.enter_tripwire("test context")
    try:
        assert DCSBase.in_tripwire()
    finally:
        DCSBase.exit_tripwire()
    assert not DCSBase.in_tripwire()


def test_nested_enter_rejected():
    DCSBase.enter_tripwire("outer")
    try:
        with pytest.raises(RuntimeError):
            DCSBase.enter_tripwire("inner")
    finally:
        DCSBase.exit_tripwire()
    assert not DCSBase.in_tripwire()


def test_resolve_blocked_in_tripwire():
    with DCSBase.tripwire(), pytest.raises(DCSTripwireError):
        asyncio.run(dcs.resolve("test_service"))


def test_resolve_sync_blocked_in_tripwire():
    with DCSBase.tripwire(), pytest.raises(DCSTripwireError):
        dcs.resolve_sync("test_service")


def test_slot_limit_blocked_in_tripwire():
    with DCSBase.tripwire("no slots here"), pytest.raises(DCSTripwireError, match="no slots here"):
        asyncio.run(dcs.get_slot_limit("test_pool"))


def test_register_blocked_in_tripwire():
    with DCSBase.tripwire(), pytest.raises(DCSTripwireError):
        asyncio.run(dcs.register("test_service", "127.0.0.1", 1234))


def test_tripwire_released_on_exception():
    with pytest.raises(ValueError), DCSBase.tripwire():
        raise ValueError("boom")
    assert not DCSBase.in_tripwire()


def test_tripwire_instance_form():
    with dcs.tripwire():
        assert DCSBase.in_tripwire()
        with pytest.raises(DCSTripwireError):
            asyncio.run(dcs.resolve("test_service"))
    assert not DCSBase.in_tripwire()
