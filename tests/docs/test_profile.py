# ----------------------------------------------------------------------
# Test profile docs
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import importlib
from pathlib import Path

# Third-party modules
import cachetools
import pytest

# NOC modules
from noc.config import config
from noc.core.profile.loader import find_profile_class

PROFILES_ROOT = config.noc_base / "adapters"
PROFILE_DOCS_BASE = Path("docs", "profiles-reference")
XFAIL_VENDORS = {"OS"}


@cachetools.cached({})
def all_profile_names() -> list[str]:
    r = []
    for d in sorted(PROFILES_ROOT.iterdir()):
        if not d.is_dir() or not (d / "profile.py").is_file():
            continue
        try:
            module = importlib.import_module(f"noc.adapters.{d.name}.profile")
        except ImportError:
            continue
        kls = find_profile_class(module)
        if kls is None or not kls.name:
            continue
        r.append(kls.name)
    return r


@cachetools.cached({})
def all_vendors() -> list[str]:
    return sorted({n.split(".")[0] for n in all_profile_names() if not n.startswith("Generic.")})


@cachetools.cached({})
def all_profiles() -> list[str]:
    return [n for n in all_profile_names() if not n.startswith("Generic.")]


@pytest.mark.parametrize("vendor", all_vendors())
def test_vendor_doc_exists(vendor) -> None:
    if vendor in XFAIL_VENDORS:
        pytest.xfail("Excluded")
    path = PROFILE_DOCS_BASE / vendor / "index.md"
    assert path.exists(), f"Vendor '{vendor}' must be documented in {path}"


@pytest.mark.parametrize("vendor", all_vendors())
def test_vendor_doc_toc(toc, vendor) -> None:
    if vendor in XFAIL_VENDORS:
        pytest.xfail("Excluded")
    path = ("References", "Profiles", vendor)
    assert path in toc
    v = toc[path].split("/")
    assert v == ["profiles-reference", vendor, "index.md"]


@pytest.mark.parametrize("profile", all_profiles())
def test_profile_doc_exists(profile) -> None:
    vendor, name = profile.split(".")
    path = PROFILE_DOCS_BASE / vendor / f"{name}.md"
    assert path.exists(), f"Profile '{profile}' must be documented in {path}"
