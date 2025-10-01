# ----------------------------------------------------------------------
# pytest configuration
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections import defaultdict
from typing import DefaultDict, Dict, List, Any
from time import perf_counter_ns
import functools
import os

# Third-party modules
import pytest
from fs import open_fs
import orjson
from django.db import models


# NOC modules
from noc.config import config
from noc.models import get_model, is_document
from noc.core.model.fields import DocumentReferenceField, CachedForeignKey

IN_GITHUB_ACTIONS = bool(os.getenv("GITHUB_ACTIONS", ""))

_stats = None
_durations: DefaultDict[str, int] = defaultdict(int)
_counts: DefaultDict[str, int] = defaultdict(int)
_start_times: Dict[str, int] = {}


def pytest_collection_modifyitems(
    session: pytest.Session, config: pytest.Config, items: List[pytest.Item]
):
    """Process @pytest.mark.run_on_startup"""

    def is_run_on_setup(item: pytest.Item) -> bool:
        return any(m.name == "run_on_setup" for m in item.own_markers)

    setup_tests = [item for item in items if is_run_on_setup(item)]
    others = [item for item in items if not is_run_on_setup(item)]
    items[:] = setup_tests + others


def pytest_runtest_setup(item: pytest.Item):
    if "test_init_db" not in item.nodeid:
        _start_times[item.nodeid] = perf_counter_ns()


def pytest_runtest_teardown(item: pytest.Item, nextitem: pytest.Item):
    start = _start_times.get(item.nodeid)
    if start is None:
        return
    duration = perf_counter_ns() - start
    # Get base function name, without parameter suffix
    func_name: str = item.originalname or item.name.split("[")[0]
    _durations[func_name] += duration
    _counts[func_name] += 1


def with_timing(name: str):
    """Measure execution time of wrapped function."""

    def inner(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            start = perf_counter_ns()
            try:
                return fn(*args, **kwargs)
            except Exception as e:
                _durations[name] += perf_counter_ns() - start
                _counts[name] += 1
                pytest.exit(f"{name} failed: {e}")
            finally:
                _durations[name] += perf_counter_ns() - start
                _counts[name] += 1

        return wrapper

    return inner


NS = 1_000_000_000.0


def pytest_terminal_summary(terminalreporter, exitstatus, config):
    global _stats

    terminalreporter.write_sep("=", "Test execution time summary")
    total = sum(float(x) / NS for x in _durations.values())
    other_time = 0.0
    other_count = 0
    THRESHOLD = 1.0
    for func_name, duration in sorted(_durations.items(), key=lambda x: x[1], reverse=True):
        label = func_name
        count = _counts.get(func_name, 0)
        if count > 1:
            label = f"{label} (x{count})"
        d = float(duration) / NS
        # Cut fast tests
        if d < THRESHOLD:
            other_time += d
            other_count += count
            continue
        percent = d * 100.0 / total
        terminalreporter.write_line(f"{label:<40} {d:.3f}s ({percent:.3f}%)")
    if other_count:
        percent = other_time * 100.0 / total
        label = "other tests"
        if other_count > 1:
            label = f"{label} (x{other_count})"
        terminalreporter.write_line(f"{label:<40} {other_time:.3f}s ({percent:.3f}%)")
    terminalreporter.write_line(f"Total: {total:.3f}s")
    _stats = terminalreporter.stats


@pytest.fixture(scope="session")
def db_postgres(request):
    """Create and destroy postgres database."""
    _create_pg_db()
    yield
    _drop_pg_db()


@pytest.fixture(scope="session")
def db_mongo(request):
    """Create and destroy mongo database."""
    _create_mongo_db()
    yield
    _drop_mongo_db()


@pytest.fixture(scope="session")
def db_clickhouse(request):
    """Create and destroy ClickHouse database."""
    _create_clickhouse_db()
    yield
    _drop_clickhouse_db()


@pytest.fixture(scope="session")
def db_kafka(request):
    """Create and destroy Kafka cluster."""
    _create_kafka_db()
    yield
    _drop_kafka_db()


@pytest.fixture(scope="session")
def database(request, db_postgres, db_mongo, db_clickhouse, db_kafka):
    _migrate_db()
    _migrate_clickhouse()
    _migrate_kafka()
    _ensure_indexes()
    _load_collections()
    _load_mibs()
    _load_fixtures()
    yield


@with_timing("create_pg_db")
def _create_pg_db():
    """Create postgres test database."""
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

    db = config.pg_connection_args.copy()
    database = db["database"]
    connect = psycopg2.connect(**db)
    connect.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    with connect.cursor() as cursor:
        # Check for database exists
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            [database],
        )
        row = cursor.fetchone()
        if not row:
            cursor.execute(f"CREATE DATABASE {database} ENCODING 'UTF-8'")
            # Check
            cursor.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s",
                [database],
            )
            row = cursor.fetchone()
            if not row:
                msg = f"Database {database} does not exist"
                raise RuntimeError(msg)


@with_timing("create_mongo_db")
def _create_mongo_db():
    """Create mongodb test database."""
    # MongoDB creates database automatically on connect
    from noc.core.mongo.connection import get_db

    db = get_db()
    coll_name = "__test"
    coll = db[coll_name]
    coll.insert_one({"ping": 1})
    doc = coll.find_one({})
    if not doc or "ping" not in doc or doc["ping"] != 1:
        msg = "Mongodb check failed: record insertion failed"
        raise RuntimeError(msg)


def _create_clickhouse_db():
    """Create clickhouse test database."""


def _create_kafka_db():
    """Initialize kafka database."""


def _drop_pg_db():
    """Drop postgresql test database"""


def _drop_mongo_db():
    """Drop mongodb database."""


def _drop_clickhouse_db():
    """Drop clickhouse database."""


def _drop_kafka_db():
    """Drop kafka database."""


@with_timing("migrate_db")
def _migrate_db():
    m = __import__("noc.commands.migrate", {}, {}, "Command")
    r = m.Command().run_from_argv([])
    if r:
        raise RuntimeError("Failed to migrate database")


@with_timing("migrate_kafka")
def _migrate_kafka():
    m = __import__("noc.commands.migrate-liftbridge", {}, {}, "Command")
    r = m.Command().run_from_argv(["--slots", "1"])
    if r:
        raise RuntimeError("Failed to create Kafka topics")


@with_timing("migrate_clickhouse")
def _migrate_clickhouse():
    m = __import__("noc.commands.migrate-ch", {}, {}, "Command")
    r = m.Command().run_from_argv([])
    if r:
        raise RuntimeError("Failed to migrate ClickHouse database")


@with_timing("ensure_indexes")
def _ensure_indexes():
    m = __import__("noc.commands.ensure-indexes", {}, {}, "Command")
    r = m.Command().run_from_argv([])
    if r:
        raise RuntimeError("Failed to create indexes")


@with_timing("collection_sync")
def _load_collections():
    from noc.core.collection.base import Collection

    Collection.sync_all()


@with_timing("load_mibs")
def _load_mibs():
    m = __import__("noc.commands.sync-mibs", {}, {}, "Command")
    r = m.Command().run_from_argv([])
    if r:
        raise RuntimeError("Failed to load MIBs")


@with_timing("load_fixtures")
def _load_fixtures():
    for url in config.tests.fixtures_paths:
        with open_fs(url) as fs:
            for path in sorted(fs.walk.files(filter=["*.json"])):
                with fs.open(path) as f:
                    data = orjson.loads(f.read())
                if not isinstance(data, list):
                    data = [data]
                for i in data:
                    _load_data(i)


model_refs = {}  # model -> name -> model
m2m_refs = {}  # model -> name -> model


def _load_data(data: List[Dict[str, Any]]) -> None:
    def _dereference(model, id):
        if hasattr(model, "get_by_id"):
            return model.get_by_id(id)
        return model.objects.get(pk=id)

    assert "$model" in data
    model = get_model(data["$model"])
    assert model
    # Get reference fields
    refs = model_refs.get(data["$model"])  # name -> model
    mrefs = m2m_refs.get(data["$model"])  # name -> model
    if refs is None:
        refs = {}
        mrefs = {}
        if not is_document(model):
            # Django models
            for f in model._meta.fields:
                if isinstance(f, (models.ForeignKey, CachedForeignKey)):
                    refs[f.name] = f.remote_field.model
                elif isinstance(f, DocumentReferenceField):
                    refs[f.name] = f.document
            for f in model._meta.many_to_many:
                if isinstance(f, models.ManyToManyField):
                    mrefs[f.name] = f.remote_field.model
        model_refs[data["$model"]] = refs
        m2m_refs[data["$model"]] = mrefs
    kwargs = {}
    m2m = {}
    for k in data:
        if k.startswith("$"):
            continue
        if k in refs:
            kwargs[k] = _dereference(refs[k], data[k])
        elif k in mrefs:
            m2m[k] = [_dereference(mrefs[k], x) for x in data[k]]
        else:
            kwargs[k] = data[k]
    d = model(**kwargs)
    d.save()
    assert d.pk
    # M2M fields
    for k in m2m:
        for r in m2m[k]:
            getattr(d, k).add(r)
