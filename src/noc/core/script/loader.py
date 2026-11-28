# ----------------------------------------------------------------------
# Script loader
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import importlib
import re
import sys
import threading
from importlib.resources import files
from pathlib import Path

# NOC modules
from noc.config import config
from noc.core.loader.base import BaseLoader
from noc.core.profile.loader import find_profile_class, iter_adapter_dirs
from noc.core.profile.names import mangle_profile_name

from .base import BaseScript


class ScriptLoader(BaseLoader):
    name = "script"

    rx_requires = re.compile(r"^\s+requires\s*=\s*\[([^\]]*)\]", re.DOTALL | re.MULTILINE)

    protected_names = {"profile", "__init__"}

    def __init__(self) -> None:
        super().__init__()
        self.scripts = {}  # Load scripts
        self.lock = threading.Lock()
        self.all_scripts = set()

    def get_script(self, name):
        """Load script and return BaseScript instance.
        Returns None when no script found or loading error occured
        """
        if name in self.protected_names:
            return None
        with self.lock:
            script = self.scripts.get(name)
            if not script:
                self.logger.info("Loading script %s", name)
                if not self.is_valid_name(name):
                    self.logger.error("Invalid script name")
                    return None
                try:
                    profile_name, sn = name.rsplit(".", 1)
                except Exception as e:
                    self.logger.error('Error in script name "%s": %s', name, e)
                    return None
                is_generic = False
                flat = mangle_profile_name(profile_name)
                for p in config.get_customized_paths(prefer_custom=True):
                    if (Path(p or str(files("noc"))) / "adapters" / flat / f"{sn}.py").is_file():
                        base_name = "noc.custom" if p else "noc"
                        module_name = f"{base_name}.adapters.{flat}.{sn}"
                        break
                else:
                    # Generic script
                    module_name = f"noc.adapters.generic__host.{sn}"
                    is_generic = True
                # Load script
                script = self.find_class(module_name, BaseScript, name)
                # Fix generic's module
                if script and is_generic:
                    # Create subclass with proper name
                    script = type("Script", (script,), {"name": name})
                    script.__module__ = f"noc.adapters.generic__host.{sn}"
                self.scripts[name] = script
            return script

    def reload(self):
        """Reset script cache and release all modules"""
        with self.lock:
            self.logger.info("Reloading scripts")
            for s in self.scripts:
                self.logger.debug("Reload script %s", s.name)
                importlib.reload(sys.modules[s.__module__])
            self.scripts = {}
            self.all_scripts = set()

    def is_valid_name(self, name):
        return ".." not in name

    def find_scripts(self):
        """Scan all available scripts"""
        ns = set()
        # Scan generic scripts for `requires` dependencies
        generics = {}  # Name -> dependencies
        for path in Path(str(files("noc"))).glob("adapters/generic__host/*.py"):
            gn = path.name[:-3]
            if gn in self.protected_names:
                continue
            data = path.read_text()
            # Scan for requires = [..]
            match = self.rx_requires.search(data)
            if match:
                generics[gn] = [s.strip()[1:-1] for s in match.group(1).split(",") if s.strip()]
        # Load custom scripts, Load common scripts
        profiles = set()
        for d, base_name in iter_adapter_dirs():
            try:
                module = importlib.import_module(f"{base_name}.adapters.{d.name}.profile")
            except ImportError as e:
                self.logger.error("Error importing adapter %s: %s", d.name, e)
                continue
            kls = find_profile_class(module)
            if kls is None or not kls.name:
                self.logger.error("No profile class with a name in %s", d.name)
                continue
            sfs = [sp for sp in sorted(d.glob("*.py")) if sp.name[:-3] not in self.protected_names]
            if not sfs:
                # No local scripts: generic application does not apply to this adapter
                continue
            profiles.add(kls.name)
            for sp in sfs:
                ns.add(f"{kls.name}.{sp.name[:-3]}")
        # Apply generic scripts
        for p in profiles:
            for g, deps in generics.items():
                fgn = f"{p}.{g}"
                if fgn in ns:
                    # Generic overriden with common script
                    continue
                if any(1 for r in deps if f"{p}.{r}" not in ns):
                    continue  # Unsatisfied dependency
                # Add generic script
                ns.add(fgn)
        with self.lock:
            self.all_scripts = ns

    def iter_scripts(self):
        """Returns all available script names"""
        if not self.all_scripts:
            self.find_scripts()
        yield from sorted(self.all_scripts)

    def has_script(self, name):
        """Check script is exists"""
        if not self.all_scripts:
            self.find_scripts()
        return name in self.all_scripts


# Create singleton object
loader = ScriptLoader()
