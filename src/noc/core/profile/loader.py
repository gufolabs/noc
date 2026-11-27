# ----------------------------------------------------------------------
# Profile loader
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import importlib
import sys
import threading
from collections.abc import Iterator
from importlib.resources import files
from pathlib import Path

# NOC modules
from noc.config import config
from noc.core.loader.base import BaseLoader

from .base import BaseProfile
from .names import mangle_profile_name

GENERIC_PROFILE = "Generic.Host"


def find_profile_class(module) -> type[BaseProfile] | None:
    """
    Return the BaseProfile subclass defined in the given module, or None.
    A module must contain exactly one such class to be a valid adapter profile.
    """
    found = [
        o
        for o in vars(module).values()
        if (
            isinstance(o, type)
            and issubclass(o, BaseProfile)
            and o is not BaseProfile
            and o.__module__ == module.__name__
        )
    ]
    if len(found) != 1:
        return None
    return found[0]


def iter_adapter_dirs() -> Iterator[tuple[Path, str]]:
    """
    Iterate over adapter directories across all customized paths.

    Yields:
        Tuples of (adapter directory, base package name, "noc" or "noc.custom").
    """
    for base in config.get_customized_paths(prefer_custom=True):
        root = Path(base or str(files("noc"))) / "adapters"
        if not root.is_dir():
            continue
        base_name = "noc.custom" if base else "noc"
        for d in sorted(root.iterdir()):
            if d.is_dir() and (d / "profile.py").is_file():
                yield d, base_name


class ProfileLoader(BaseLoader):
    name = "profile"

    def __init__(self) -> None:
        super().__init__()
        self.profiles = {}  # Load profiles
        self.lock = threading.Lock()
        self.all_profiles = set()

    def get_profile(self, name) -> type[BaseProfile] | None:
        """
        Load profile and return BaseProfile instance.
        Returns None when no profile found or loading error occured
        """
        with self.lock:
            profile = self.profiles.get(name)
            if not profile:
                self.logger.info("Loading profile %s", name)
                if not self.is_valid_name(name):
                    self.logger.error("Invalid profile name")
                    return None
                flat = mangle_profile_name(name)
                for d, base_name in iter_adapter_dirs():
                    if d.name != flat:
                        continue
                    profile = self.find_class(
                        f"{base_name}.adapters.{flat}.profile", BaseProfile, name
                    )
                    if profile:
                        profile.initialize()
                        break
                else:
                    self.logger.error(
                        "Profile %s not found. Custom adapters must use the flat "
                        "layout adapters/<flat>; see the release notes for the "
                        "migration guide.",
                        name,
                    )
                self.profiles[name] = profile
            return profile

    def reload(self):
        """
        Reset profile cache and release all modules
        """
        with self.lock:
            self.logger.info("Reloading profiles")
            for s in self.profiles:
                self.logger.debug("Reload profile %s", s.name)
                importlib.reload(sys.modules[s.__module__])
            self.profiles = {}
            self.all_profiles = set()

    def is_valid_name(self, name):
        return ".." not in name

    def find_profiles(self):
        """
        Scan all available profiles.

        Imports each adapter's profile module and reads the profile class
        name. A failing adapter is logged and skipped.
        """
        ns = set()
        for d, base_name in iter_adapter_dirs():
            module_name = f"{base_name}.adapters.{d.name}.profile"
            try:
                module = importlib.import_module(module_name)
            except ImportError as e:
                self.logger.error("Error importing adapter %s: %s", module_name, e)
                continue
            kls = find_profile_class(module)
            if kls is None or not kls.name:
                self.logger.error("No profile class with a name in %s", module_name)
                continue
            ns.add(kls.name)
        with self.lock:
            self.all_profiles = ns

    def iter_profiles(self):
        """
        Returns all available profile names
        """
        if not self.all_profiles:
            self.find_profiles()
        yield from sorted(self.all_profiles)

    def has_profile(self, name):
        """
        Check profile is exists
        """
        if not self.all_profiles:
            self.find_profiles()
        return name in self.all_profiles

    def choices(self):
        return [(p, p) for p in self.iter_profiles()]


# Create singleton object
loader = ProfileLoader()
