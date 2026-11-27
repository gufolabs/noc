# ----------------------------------------------------------------------
# Profile/script loader snapshot test
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import json
from pathlib import Path

# NOC modules
from noc.core.profile.loader import loader as profile_loader
from noc.core.script.loader import loader as script_loader

# Snapshot files freeze the loader output of the legacy
# sa/profiles/<vendor>/<software> layout. They must remain unchanged when
# the flat adapters/<flat> layout is introduced.
FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_profile_loader_snapshot() -> None:
    expected = json.loads((FIXTURES / "profile_loader_snapshot.json").read_text())
    assert list(profile_loader.iter_profiles()) == expected


def test_script_loader_snapshot() -> None:
    expected = json.loads((FIXTURES / "script_loader_snapshot.json").read_text())
    assert list(script_loader.iter_scripts()) == expected
