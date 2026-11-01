# ----------------------------------------------------------------------
# Test postgresql tables
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import connection

# NOC modules
from noc.models import DB_MODEL_TYPE
from tests.database import DatabaseInfo


def test_db_table(models: DB_MODEL_TYPE, database: DatabaseInfo) -> None:
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM pg_class WHERE relname=%s", [models._meta.db_table])
    assert cursor.fetchall()[0][0] == 1, f"Database table '{models._meta.db_table}' is not exists"


def test_model_count(models: DB_MODEL_TYPE, database: DatabaseInfo) -> None:
    cursor = connection.cursor()
    cursor.execute(f"SELECT COUNT(*) FROM {models._meta.db_table}")


def test_document_count(documents: DB_MODEL_TYPE, database: DatabaseInfo) -> None:
    documents._get_collection().count_documents({})
