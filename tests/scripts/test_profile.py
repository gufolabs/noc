# ----------------------------------------------------------------------
# SA Profile test
# ----------------------------------------------------------------------
# Copyright (C) 2007-2018 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import os
import sys
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

# Third-party modules
import pytest

# NOC modules
from noc.config import config
from noc.core.importer import NOCImportRouter
from noc.core.profile.base import BaseProfile
from noc.core.profile.loader import ProfileLoader, loader
from noc.core.profile.names import mangle_profile_name


def clear_custom_modules() -> None:
    """Remove custom modules from the import cache."""
    for module_name in list(sys.modules):
        if module_name == "noc.custom" or module_name.startswith("noc.custom."):
            del sys.modules[module_name]


@contextmanager
def custom_profile_path(path: Path) -> Iterator[None]:
    """Temporarily configure a custom module root for profile tests."""
    router = next(x for x in sys.meta_path if isinstance(x, NOCImportRouter))
    old_path = config.path.custom_path
    clear_custom_modules()
    router.set_custom_path(path)
    try:
        yield
    finally:
        clear_custom_modules()
        router.set_custom_path(old_path)


def write_custom_profile(root: Path, profile_name: str) -> None:
    """Create a minimal custom adapter for a profile name."""
    root.mkdir(parents=True, exist_ok=True)
    (root / "__init__.py").touch()
    profile_path = root / "adapters" / mangle_profile_name(profile_name)
    package = profile_path
    while package != root:
        package.mkdir(parents=True, exist_ok=True)
        (package / "__init__.py").touch()
        package = package.parent
    (profile_path / "profile.py").write_text(
        "from noc.core.profile.base import BaseProfile\n\n"
        "class Profile(BaseProfile):\n"
        f"    name = {profile_name!r}\n"
        "    is_custom_profile = True\n",
        encoding="utf-8",
    )


def get_profiles():
    if os.environ.get("NOC_TEST_PROFILE"):
        p_name = os.environ["NOC_TEST_PROFILE"]
        return [x for x in loader.iter_profiles() if x == p_name]
    return list(loader.iter_profiles())


@pytest.fixture(scope="session", params=get_profiles())
def sa_profile(request):
    return request.param


def test_iter_profiles() -> None:
    assert len(list(loader.iter_profiles())) > 0


def test_profile_loading(sa_profile) -> None:
    profile = loader.get_profile(sa_profile)
    assert profile is not None


def test_profile_type(sa_profile) -> None:
    profile = loader.get_profile(sa_profile)
    assert issubclass(profile, BaseProfile)


def test_profile_name(sa_profile) -> None:
    profile = loader.get_profile(sa_profile)
    assert getattr(profile, "name"), "Profile should has name"
    parts = profile.__module__.split(".")
    assert parts[-1] == "profile", "Profile must be in profile.py"
    assert profile.name == sa_profile


@pytest.mark.parametrize(
    ("profile_name", "module_name"),
    [
        ("Generic.Host", "noc.custom.adapters.generic__host.profile"),
        ("Juniper.JUNOS", "noc.custom.adapters.juniper__junos.profile"),
        ("3Com.4500", "noc.custom.adapters._3com__4500.profile"),
        ("HP.1910", "noc.custom.adapters.hp__1910.profile"),
    ],
)
def test_custom_profile_overrides_repository_profile(
    tmp_path: Path, profile_name: str, module_name: str
) -> None:
    write_custom_profile(tmp_path, profile_name)

    with custom_profile_path(tmp_path):
        profile = ProfileLoader().get_profile(profile_name)

    assert profile is not None
    assert profile.__module__ == module_name
    assert getattr(profile, "is_custom_profile", False) is True
