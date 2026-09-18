# ----------------------------------------------------------------------
# noc.core.typing tests
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.core.typing import SENTINEL


def test_sentinel_get() -> None:
    data = {
        "none": None,
        "false": False,
        "zero": 0,
    }

    assert data.get("missing", SENTINEL) is SENTINEL

    assert data.get("none", SENTINEL) is None
    assert data.get("false", SENTINEL) is False
    assert data.get("zero", SENTINEL) == 0
