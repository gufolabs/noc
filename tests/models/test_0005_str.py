# ----------------------------------------------------------------------
# Test __str__ method
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.models import DB_MODEL_TYPE
from tests.database import DatabaseInfo


def test_model_str(models: DB_MODEL_TYPE, database: DatabaseInfo) -> None:
    for o in models.objects.all():
        s = str(o)
        assert s
        assert isinstance(s, str)


def test_document_str(documents: DB_MODEL_TYPE, database: DatabaseInfo) -> None:
    for o in documents.objects.all():
        s = str(o)
        assert isinstance(s, str)
