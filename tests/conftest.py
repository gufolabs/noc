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


@pytest.fixture(scope="session", autouse=True)
def fatal_check(request):
    """Run over every test and process fatai failires."""
    yield
    if hasattr(request.node, "fatal_failed"):
        pytest.exit("A required test failed. Aborting further tests.", returncode=1)


def pytest_runtest_makereport(item, call):
    """Process @pytest.mark.fatal"""
    if "fatal" in item.keywords and call.excinfo is not None:
        # Mark in session that fatal test failed
        item.session.fatal_failed = True


@pytest.fixture(scope="session")
def database(request):
    """Create and destroy test databases."""
    # Create databases
    _create_pg_db()
    _create_mongo_db()
    _create_clickhouse_db()
    # Return control to the test
    yield
    # Cleanup databases
    _drop_pg_db()
    _drop_mongo_db()
    _drop_clickhouse_db()


def _create_pg_db():
    """Create postgres test database."""
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

    db = config.pg_connection_args.copy()
    db["database"] = "postgres"
    connect = psycopg2.connect(**db)
    connect.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = connect.cursor()
    cursor.execute(f"CREATE DATABASE {config.pg.db} ENCODING 'UTF-8'")
    cursor.close()
    connect.close()


def _create_mongo_db():
    """Create mongodb test database."""
    # MongoDB creates database automatically on connect
    import mongoengine

    mongoengine.connect()


def _create_clickhouse_db():
    """
    Create clickhouse test database
    :return:
    """


def _drop_pg_db():
    """Drop postgresql test database"""
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

    tpl = config.pg_connection_args.copy()
    tpl["database"] = "postgres"
    connect = psycopg2.connect(**tpl)
    connect.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = connect.cursor()
    # Forcefully disconnect remaining connections
    cursor.execute(
        """
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = %s
    """,
        [config.pg.db],
    )
    # Drop
    cursor.execute(f"DROP DATABASE IF EXISTS {config.pg.db}")
    cursor.close()
    connect.close()


def _drop_mongo_db():
    """Drop mongodb database."""
    import mongoengine

    client = mongoengine.connect(**config.mongo_connection_args)
    client.drop_database(config.mongo.db)
    client.close()


def _drop_clickhouse_db():
    """Drop clickhouse database."""


# Dependencies name
DB_READY = "test_db_ready"
DB_MIGRATED = "test_db_migrated"
DB_COLLECTION = "test_db_collection"
