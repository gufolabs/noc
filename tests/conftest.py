# ----------------------------------------------------------------------
# pytest configuration
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections import defaultdict
from typing import DefaultDict, Dict
from time import perf_counter_ns

# Third-party modules
import pytest
import pymongo

# NOC modules
from noc.config import config


_stats = None
_durations: DefaultDict[str, int] = defaultdict(int)
_counts: DefaultDict[str, int] = defaultdict(int)
_start_times: Dict[str, int] = {}


def pytest_runtest_setup(item):
    _start_times[item.nodeid] = perf_counter_ns()


def pytest_runtest_teardown(item, nextitem):
    start = _start_times.get(item.nodeid)
    if start is None:
        return
    duration = perf_counter_ns() - start
    # Get base function name, without parameter suffix
    func_name: str = item.originalname or item.name.split("[")[0]
    _durations[func_name] += duration
    _counts[func_name] += 1


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
    yield


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
                pytest.exit(f"Database {database} does not exist", returncode=1)


def _create_mongo_db():
    """Create mongodb test database."""
    # MongoDB creates database automatically on connect
    from noc.core.mongo.connection import get_db

    try:
        db = get_db()
        coll_name = "__test"
        coll = db[coll_name]
        coll.insert_one({"ping": 1})
    except pymongo.errors.OperationFailure as e:
        pytest.exit(f"Failed to connect mongodb: {e}", returncode=1)
    doc = coll.find_one({})
    if not doc or "ping" not in doc or doc["ping"] != 1:
        pytest.exit("Mongodb check failed: record insertion failed")


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


def _migrate_db():
    m = __import__("noc.commands.migrate", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0


def _migrate_kafka():
    m = __import__("noc.commands.migrate-liftbridge", {}, {}, "Command")
    assert m.Command().run_from_argv(["--slots", "1"]) == 0


def _migrate_clickhouse():
    m = __import__("noc.commands.migrate-ch", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0


def _ensure_indexes():
    m = __import__("noc.commands.ensure-indexes", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0


def _load_collections():
    m = __import__("noc.commands.collection-sync", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0


def _load_mibs():
    m = __import__("noc.commands.sync-mibs", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0
