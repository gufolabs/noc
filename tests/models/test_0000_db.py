# ----------------------------------------------------------------------
# Test all database is present.
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third party modules
import psycopg2
import mongoengine
import pytest

# NOC modules
from noc.config import config
from noc.core.mongo.connection import get_db


@pytest.mark.fatal
def test_pg(database) -> None:
    db = config.pg_connection_args.copy()
    database = db["database"]
    connect = psycopg2.connect(**db)
    with connect.cursor() as cur:
        cur.execute(
            sql.SQL("SELECT 1 FROM pg_database WHERE datname = %s"),
            [database],
        )
        assert cur.fetchone() is not None, f"Database {database} does not exist"


@pytest.mark.fatal
def test_mongo(database) -> None:
    db = get_db()
    coll_name = "__test"
    coll = db[coll_name]
    coll.insert_one({"ping": 1})
    doc = coll.find_one({})
    assert doc
    assert "ping" in doc
    assert doc["ping"] == 1
