# ---------------------------------------------------------------------
# Test sa scripts
# ---------------------------------------------------------------------
# Copyright (C) 2007-2018 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import os

# Third-party modules
import pytest

# NOC modules
from noc.core.interface.base import BaseInterface
from noc.core.profile.names import mangle_profile_name
from noc.core.script.base import BaseScript
from noc.core.script.loader import loader

IGNORED_VENDOR = ["VMWare"]


def get_scripts():
    if os.environ.get("NOC_TEST_SCRIPT"):
        s_name = os.environ["NOC_TEST_SCRIPT"]
        return [x for x in loader.iter_scripts() if x == s_name]
    if os.environ.get("NOC_TEST_PROFILE"):
        p_name = "{}.".format(os.environ["NOC_TEST_PROFILE"])
        return [x for x in loader.iter_scripts() if x.startswith(p_name)]
    return [x for x in loader.iter_scripts() if x.split(".")[0] not in IGNORED_VENDOR]


@pytest.fixture(scope="session", params=get_scripts())
def sa_script(request):
    return request.param


def test_iter_scripts() -> None:
    assert len(list(loader.iter_scripts())) > 0


def test_script_loading(sa_script) -> None:
    script = loader.get_script(sa_script)
    assert script is not None


def test_script_type(sa_script) -> None:
    script = loader.get_script(sa_script)
    assert issubclass(script, BaseScript)


def test_script_name(sa_script) -> None:
    script = loader.get_script(sa_script)
    assert getattr(script, "name"), "Script should has name"
    profile_name, sn = script.name.rsplit(".", 1)
    flat = mangle_profile_name(profile_name)
    expected = (
        f"noc.adapters.{flat}.{sn}",
        f"noc.custom.adapters.{flat}.{sn}",
        f"noc.adapters.generic__host.{sn}",
    )
    assert script.__module__ in expected, f"Unexpected module {script.__module__}"


def test_script_interface(sa_script) -> None:
    script = loader.get_script(sa_script)
    assert getattr(script, "interface", None) is not None, "Script should has 'interface' attribute"
    assert issubclass(script.interface, BaseInterface)
