# ----------------------------------------------------------------------
# Custom python module importer
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import sys
import os
import importlib
import importlib.abc
import importlib.util
from importlib.machinery import ModuleSpec
from pathlib import Path
from typing import Optional, Sequence, Any, Type, Set
from types import ModuleType

# NOC modules
from noc.config import config


class NOCLoader(importlib.abc.Loader):
    """
    Abstract class for prefixed loader
    """

    PREFIX: str
    INIT_SOURCE = ""
    packages: Set[str] = set()

    def __init__(self, path_entry: Optional[str] = None):
        self.path_entry: Optional[str] = path_entry
        self.packages.add(self.PREFIX)

    def get_source(self, fullname: str) -> Optional[str]:
        """
        Get source for module.

        Args:
            fullname: Full module name (dot-separated).

        Returns:
            Module's source code, if any.
        """
        raise NotImplementedError()

    def is_package(self, fullname: str) -> bool:
        return fullname in self.packages

    def get_filename(self, fullname: str) -> str:
        """
        Get file name for module.

        Args:
            fullname: Full module name (dot-separated).

        Returns:
            Appropriate filename.
        """
        base = Path(self.path_entry or "") / Path(*fullname.split("."))
        if self.is_package(fullname):
            return str(base / "__init__.py")
        return str(base.with_suffix(".py"))

    def create_module(self, spec: ModuleSpec) -> Optional[ModuleType]:
        """
        Use default module creation.

        Part of the Loader protocol.
        """
        return None  # default behavior

    def exec_module(self, module: ModuleType) -> None:
        """
        Execute module source in its namespace.

        Part of the Loader protocol.
        """
        source = self.get_source(module.__name__)
        if source is None:
            msg = f"Cannot load module {module.__name__}"
            raise ImportError(msg)
        code = compile(source, self.get_filename(module.__name__), "exec", dont_inherit=True)
        exec(code, module.__dict__)

    @classmethod
    def is_match(cls, fullname: str) -> bool:
        """Check if module name falls behing loader."""
        return fullname == cls.PREFIX or fullname.startswith(cls.PREFIX + ".")


class NOCPyruleLoader(NOCLoader):
    PREFIX = "noc.pyrules"
    COLLECTION_NAME = "pyrules"
    _collection = None

    def _get_collection(self):
        if not self._collection:
            from noc.core.mongo.connection import get_db

            self._collection = get_db()[self.COLLECTION_NAME]
        return self._collection

    def get_source(self, fullname: str) -> Optional[str]:
        key = fullname[len(self.PREFIX) + 1 :]
        if not key:
            return self.INIT_SOURCE  # noc.pyrules package itself
        coll = self._get_collection()
        # Try to load module
        d = coll.find_one({"name": key}, {"_id": 0, "source": 1})
        if d:
            return d.get("source")
        # Check if it's a package
        nc = key.replace(".", "\\.")
        sub = coll.find_one({"name": {"$regex": rf"^{nc}\."}})
        if sub:
            self.packages.add(fullname)
            return self.INIT_SOURCE
        return None


class NOCCustomLoader(NOCLoader):
    PREFIX = "noc.custom"

    def get_source(self, fullname: str) -> Optional[str]:
        key = fullname[len(self.PREFIX) + 1 :]
        if not key:
            return self.INIT_SOURCE  # noc.custom package itself
        base_path = Path(config.path.custom_path) / Path(*key.split("."))
        file_path = base_path.with_suffix(".py")
        if file_path.exists():
            return file_path.read_text(encoding="utf-8")
        if base_path.exists():
            self.packages.add(fullname)
            return self.INIT_SOURCE
        return None


class NOCImportRouter(importlib.abc.MetaPathFinder):
    """Finder that delegates to NOC-specific loaders based on prefix."""

    def __init__(self):
        self._check_custom = config.path.custom_path and os.path.exists(config.path.custom_path)

    def find_spec(
        self, fullname: str, path: Optional[Sequence[str]] = None, target: Optional[Any] = None
    ) -> Optional[ModuleSpec]:
        def _get_spec(loader_cls: Type[NOCLoader]) -> Optional[ModuleSpec]:
            loader = loader_cls(path_entry=(path[0] if path else None))
            return importlib.util.spec_from_loader(
                fullname, loader, is_package=loader.is_package(fullname)
            )

        if self._check_custom and NOCCustomLoader.is_match(fullname):
            return _get_spec(NOCCustomLoader)
        if NOCPyruleLoader.is_match(fullname):
            return _get_spec(NOCPyruleLoader)
        return None


# Install loader
sys.meta_path.append(NOCImportRouter())
