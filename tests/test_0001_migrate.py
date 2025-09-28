# ----------------------------------------------------------------------
# Database migrations
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections import defaultdict

# Third-party modules
import pytest
import cachetools

# NOC modules
from noc.core.migration.base import BaseMigration
from noc.core.migration.loader import loader
from noc.core.migration.runner import MigrationRunner
from .conftest import DB_READY, DB_MIGRATED


@cachetools.cached({})
def get_migration_names():
    return list(loader.iter_migration_names())


@cachetools.cached({})
def get_migration_names_set():
    return set(get_migration_names())


@cachetools.cached({})
def get_migration_plan():
    return list(loader.iter_plan())


@cachetools.cached({})
def get_planned_counts():
    try:
        r = defaultdict(int)
        for p in get_migration_plan():
            r[p.get_name()] += 1
        return r
    except ValueError:
        return {}


@cachetools.cached({})
def get_migration_orders():
    r = {}
    for p in get_migration_plan():
        r[p.get_name()] = len(r)
    return r


@pytest.mark.parametrize("name", get_migration_names())
def test_migration_class(name):
    migration = loader.get_migration(name)
    assert migration
    assert isinstance(migration, BaseMigration)


@pytest.mark.parametrize("name", get_migration_names())
def test_migration_depends_on(name):
    migration = loader.get_migration(name)
    assert migration
    if not migration.depends_on:
        return
    assert isinstance(migration.depends_on, list), "depends_on must be of list type"
    for r in migration.depends_on:
        assert isinstance(r, tuple), "depends_on item must be of tuple type"
        assert len(r) == 2, "depends_on item must have size of 2"
        dep_name = "%s.%s" % (r[0], r[1])
        assert dep_name in get_migration_names_set(), "Unknown dependency %s" % r


@pytest.mark.parametrize("name", get_migration_names())
def test_migration_in_plan(name):
    assert name in get_planned_counts()


@pytest.mark.parametrize("name", get_migration_names())
def test_migration_duplicates(name):
    assert name in get_planned_counts()
    assert get_planned_counts()[name] == 1, "Duplicated migration in plan"


@pytest.mark.parametrize("name", get_migration_names())
def test_migration_order(name):
    migration = loader.get_migration(name)
    assert migration
    if not migration.depends_on:
        return
    orders = get_migration_orders()
    assert name in orders, "Unordered migration"
    for d in migration.dependencies:
        assert d in orders, "Unordered dependency"
        assert orders[d] < orders[name], "Out-of-order dependency"


@pytest.mark.dependency(depends_on=[DB_READY])
@pytest.mark.fatal
def test_database_migrations(database):
    """
    Force database migrations
    :param database:
    :return:
    """
    runner = MigrationRunner()
    runner.migrate()


@pytest.mark.dependency(depends_on=["test_database_migrations"])
@pytest.mark.fatal
def test_migration_history(database):
    """
    Test all migrations are in `migrations` collection
    """
    runner = MigrationRunner()
    applied = runner.get_history()
    all_migrations = get_migration_names_set()
    assert all_migrations == applied


@pytest.mark.dependency()
@pytest.mark.fatal
def test_migration_kafka(database):
    """Test migrate-liftbridge"""
    m = __import__("noc.commands.migrate-liftbridge", {}, {}, "Command")
    assert m.Command().run_from_argv(["--slots", "1"]) == 0


@pytest.mark.dependency()
@pytest.mark.fatal
def test_migration_ch(database):
    """Test migrate-ch"""
    m = __import__("noc.commands.migrate-ch", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0


@pytest.mark.dependency(depends=["test_migration_history"])
@pytest.mark.fatal
def test_ensure_indexes(database):
    """
    Create indexes
    :param database:
    :return:
    """
    m = __import__("noc.commands.ensure-indexes", {}, {}, "Command")
    assert m.Command().run_from_argv([]) == 0


@pytest.mark.dependency(
    name=DB_MIGRATED,
    depends_on=[
        "test_migration_history",
        "test_migration_kafka",
        "test_migration_ch",
        "test_ensure_indexes",
    ],
)
def test_db_migrated() -> None:
    """Grouping element"""
