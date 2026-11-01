# ----------------------------------------------------------------------
# Test .get_by_id()
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import bson

# NOC modules
from noc.models import DB_MODEL_TYPE
from tests.database import DatabaseInfo


def test_model_get_by_id(
    models_with_get_by_id: DB_MODEL_TYPE, database: DatabaseInfo
) -> None:
    assert callable(models_with_get_by_id.get_by_id)
    r = models_with_get_by_id.objects.all()[:1]
    if r:
        r = r[0]
        record = models_with_get_by_id.get_by_id(r.pk)
        assert record
        assert record.pk == r.pk
    else:
        record = models_with_get_by_id.get_by_id(0)
        assert not record


def test_document_get_by_id(
    documents_with_get_by_id: DB_MODEL_TYPE, database: DatabaseInfo
) -> None:
    assert callable(documents_with_get_by_id.get_by_id)
    r = documents_with_get_by_id.objects.first()
    if r:
        record = documents_with_get_by_id.get_by_id(r.pk)
        assert record
        assert record.pk == r.pk
        record = documents_with_get_by_id.get_by_id(str(r.pk))
        assert record
        assert record.pk == r.pk
    else:
        record = documents_with_get_by_id.get_by_id(bson.ObjectId())
        assert not record
        record = documents_with_get_by_id.get_by_id("000000000000000000000000")
        assert not record
