# ---------------------------------------------------------------------
# Test python module loading
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import ast
import importlib
from collections.abc import Iterable, Iterator
from contextlib import contextmanager
from pathlib import Path

# Third-party modules
import cachetools
import mongoengine.connection
import mongoengine.document
import pytest
from django.db.backends.base.base import BaseDatabaseWrapper  # type: ignore[import-untyped]

# NOC modules
from noc.config import config
from noc.core.clickhouse.connect import ClickhouseClient
from noc.core.dcs.base import DCSBase, DCSTripwireError
from noc.core.mongo import connection as noc_mongo_connection


class DBBlockedError(RuntimeError):
    """Raised when a database is accessed while it is blocked."""


@contextmanager
def block_databases() -> Iterator[None]:
    """
    Block all database access (MongoDB, PostgreSQL, ClickHouse).

    Used as an import-time guard: NOC modules must not query databases
    while being imported. In CI the infrastructure containers are
    available, so real connections would silently succeed and hide such
    bugs. The block is temporary and restored on exit.
    """

    def blocked(*args, **kwargs):
        raise DBBlockedError("Database access during module import")

    targets = [
        # MongoDB (mongoengine)
        (mongoengine.document.Document, "_get_collection"),
        (mongoengine.document, "get_db"),
        (mongoengine.connection, "get_db"),
        (mongoengine.connection, "_get_db"),
        (mongoengine.connection, "_get_connection"),
        (noc_mongo_connection, "_get_db"),
        (noc_mongo_connection, "_get_connection"),
        # PostgreSQL (Django ORM)
        (BaseDatabaseWrapper, "ensure_connection"),
        # ClickHouse
        (ClickhouseClient, "execute"),
    ]
    saved = []
    try:
        for obj, attr in targets:
            if isinstance(obj, type) and attr in vars(obj):
                original = vars(obj)[attr]
            else:
                original = getattr(obj, attr)
            saved.append((obj, attr, original))
            setattr(obj, attr, blocked)
        yield
    finally:
        for obj, attr, original in saved:
            setattr(obj, attr, original)


# Transitonal only guard.
# Remove after step 8 of NEP-0101
assert config.noc_base.parts[-2:] == ("src", "noc"), f"Invalid {config.noc_base}"

_ALLOW_XFAIL = {
    "noc.services.login.backends.pam",
    "noc.services.web.apps.kb.parsers.mediawiki",
    "noc.gis.tile",
    "noc.core.etl.extractor.vcenter",
    "noc.core.etl.extractor.zabbix",
    "noc.services.metricscollector.paths.vmagent",
    "noc.services.metricscollector.models.vmagent",
}


def _allow_xfail(module: str) -> bool:
    """
    Allow module to be xfail due to import errors
    :param module: Module name
    :return:
    """
    return module in _ALLOW_XFAIL or module.startswith("noc.sa.profiles.VMWare")


@cachetools.cached(cache={})
def get_files() -> list[Path]:
    """Get list of all Python files in the NOC package."""
    return [
        path
        for path in config.noc_base.rglob("*.py", recurse_symlinks=True)
        if not path.name.startswith(".")
    ]


INIT_PY = "__init__.py"


def iter_py_modules() -> Iterable[str]:
    """Iterate over module names."""
    root = config.noc_base.parent
    for path in get_files():
        rel = path.relative_to(root)
        if path.name == INIT_PY:
            yield ".".join(rel.parts[:-1])
        else:
            yield ".".join(rel.with_suffix("").parts)


def iter_init() -> Iterable[Path]:
    """Iterate __init__.py paths."""
    for path in get_files():
        if path.name == INIT_PY:
            yield path


@pytest.mark.parametrize("module", list(iter_py_modules()))
def test_import(module: str) -> None:
    try:
        # Module imports must not perform DCS service resolution or
        # database access. Without these guards a blocking DCS/Consul
        # resolution or a database query triggered at import time hangs
        # the test run (DCS) or silently succeeds in CI (databases),
        # hiding import-time side effects.
        with DCSBase.tripwire("DCS access during module import"), block_databases():
            m = importlib.import_module(module)
        assert m
    except DCSTripwireError as e:
        pytest.fail(f"{module}: {e}")
    except DBBlockedError as e:
        pytest.fail(f"{module}: {e}")
    except (ImportError, ModuleNotFoundError, NotImplementedError) as e:
        if _allow_xfail(module):
            pytest.xfail(str(e))
        else:
            pytest.fail(str(e))


@pytest.mark.parametrize("path", list(iter_init()))
def test_init(path: Path) -> None:
    data = path.read_text()
    if "TESTS: ALLOW_NON_EMPTY_INIT" in data:
        pytest.skip("allowed to be non-empty")
    n = compile(data, path, "exec", ast.PyCF_ONLY_AST)
    assert bool(n.body) or not bool(data), f"{path} must be empty"
