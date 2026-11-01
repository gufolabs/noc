# ----------------------------------------------------------------------
# Test .get_by_bi_id()
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.models import DB_MODEL_TYPE


def test_model_get_by_bi_id(models_with_get_by_bi_id: DB_MODEL_TYPE) -> None:
    assert callable(models_with_get_by_bi_id.get_by_bi_id)
    r = models_with_get_by_bi_id.objects.all()[:1]
    if r:
        r = r[0]
        record = models_with_get_by_bi_id.get_by_bi_id(r.bi_id)
        assert record
        assert record.bi_id == r.bi_id
    else:
        record = models_with_get_by_bi_id.get_by_bi_id(0)
        assert not record


def test_document_get_by_bi_id(documents_with_get_by_bi_id: DB_MODEL_TYPE) -> None:
    assert callable(documents_with_get_by_bi_id.get_by_bi_id)
    r = documents_with_get_by_bi_id.objects.first()
    if r:
        record = documents_with_get_by_bi_id.get_by_bi_id(r.bi_id)
        assert record
        assert record.bi_id == r.bi_id
    else:
        record = documents_with_get_by_bi_id.get_by_bi_id(0)
        assert not record
