# ----------------------------------------------------------------------
# BaseProfile metaclass test
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import pytest

# NOC modules
from noc.core.profile.base import BaseProfile


def test_profile_without_name_raises() -> None:
    with pytest.raises(RuntimeError, match="'name' is required"):

        class Profile(BaseProfile):
            pass


def test_profile_with_name_ok() -> None:
    class Profile(BaseProfile):
        name = "Vendor.System"

    assert Profile.name == "Vendor.System"


def test_profile_inherited_name_ok() -> None:
    class Parent(BaseProfile):
        name = "Vendor.System"

    class Child(Parent):
        pass

    assert Child.name == "Vendor.System"


def test_base_profile_itself_ok() -> None:
    assert BaseProfile.name is None
