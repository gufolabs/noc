# ----------------------------------------------------------------------
# Test sync-mibs
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import pytest

# NOC modules
from .conftest import DB_MIGRATED


@pytest.mark.dependency(depends=[DB_MIGRATED])
@pytest.mark.fatal
def test_sync_mibs(database):
    """
    Test sync-mibs
    :param database:
    :return:
    """
    m = __import__("noc.commands.sync-mibs", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0
