# ----------------------------------------------------------------------
# Profile name mangling test
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import pytest

# NOC modules
from noc.core.profile.names import mangle_profile_name


@pytest.mark.parametrize(
    ("name", "mangled"),
    [
        ("Cisco.IOS", "cisco__ios"),
        ("3Com.4500", "_3com__4500"),
        ("IRE-Polus.Horizon", "ire_polus__horizon"),
        ("Brocade.CER-ADV", "brocade__cer_adv"),
        ("DLink.DxS_Cisco_CLI", "dlink__dxs_cisco_cli"),
        ("Generic.Host", "generic__host"),
        ("Cisco.ROS.XR", "cisco__ros__xr"),
        ("_Foo.Bar", "__foo__bar"),
    ],
)
def test_mangle_profile_name(name, mangled) -> None:
    assert mangle_profile_name(name) == mangled


def test_mangle_profile_name_idempotent_input_case() -> None:
    # Case is folded: mangled output never contains uppercase
    assert mangle_profile_name("CISCO.Ios") == "cisco__ios"
