# ----------------------------------------------------------------------
# Profile name mangling test
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import pytest

# NOC modules
from noc.core.profile.names import (
    mangle_profile_module_name,
    mangle_profile_name,
    unmangle_profile_module_name,
)


@pytest.mark.parametrize(
    ("name", "mangled"),
    [
        ("Generic.Host", "Generic.Host"),
        ("Cisco.IOS", "Cisco.IOS"),
        ("3Com.SuperStack", "_3Com.SuperStack"),
        ("3Com.4500", "_3Com._4500"),
        ("HP.1910", "HP._1910"),
        ("Alcatel.7324RU", "Alcatel._7324RU"),
        ("IRE-Polus.Horizon", "IRE-Polus.Horizon"),
    ],
)
def test_mangle_profile_module_name(name, mangled) -> None:
    assert mangle_profile_module_name(name) == mangled


@pytest.mark.parametrize(
    ("name", "unmangled"),
    [
        ("Generic.Host", "Generic.Host"),
        ("_3Com.SuperStack", "3Com.SuperStack"),
        ("_3Com._4500", "3Com.4500"),
        ("HP._1910", "HP.1910"),
        ("Alcatel._7324RU", "Alcatel.7324RU"),
        ("_foo.bar", "_foo.bar"),
        ("_._42", "_.42"),
    ],
)
def test_unmangle_profile_module_name(name, unmangled) -> None:
    assert unmangle_profile_module_name(name) == unmangled


@pytest.mark.parametrize(
    "name",
    [
        "Generic.Host",
        "Cisco.IOS",
        "3Com.4500",
        "HP.1910",
    ],
)
def test_roundtrip(name) -> None:
    assert unmangle_profile_module_name(mangle_profile_module_name(name)) == name


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
