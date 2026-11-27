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
from importlib.resources import files
from pathlib import Path

# NOC modules
from noc.config import config
from noc.core.loader.base import BaseLoader

from .base import BaseProfile
from .names import mangle_profile_module_name, unmangle_profile_module_name

GENERIC_PROFILE = "Generic.Host"


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
                mangled = mangle_profile_module_name(name)
                for p in config.get_customized_paths(prefer_custom=True):
                    path = Path(p or str(files("noc"))).joinpath(
                        "sa", "profiles", *mangled.split(".")
                    )
                    if not (path / "profile.py").is_file():
                        continue
                    base_name = "noc.custom" if p else "noc"
                    module_name = f"{base_name}.sa.profiles.{mangled}"
                    profile = self.find_class(f"{module_name}.profile", BaseProfile, name)
                    if profile:
                        profile.initialize()
                        break
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
        Scan all available profiles
        """
        ns = set()
        for base in config.get_customized_paths(prefer_custom=True):
            for path in Path(base or str(files("noc"))).glob("sa/profiles/*/*/__init__.py"):
                vendor, system = path.parts[-3:-1]
                ns.add(unmangle_profile_module_name(f"{vendor}.{system}"))
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
