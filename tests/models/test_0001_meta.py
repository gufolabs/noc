# ----------------------------------------------------------------------
# Test all models
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# NOC modules
from noc.models import DB_MODEL_TYPE, get_model, get_model_id, iter_model_id


def test_iter_model_id() -> None:
    """
    Check iter_model_id is not empty
    """
    assert any(iter_model_id()), "Empty model id"


def test_model_loading(model_ids: str) -> None:
    """
    Check model referred by id can be loaded
    :return:
    """
    model = get_model(model_ids)
    assert model is not None, f"Cannot load model {model_ids}"


def test_model_id(model_ids: str) -> None:
    """
    Check model has same model_id as referred
    """
    model = get_model(model_ids)
    assert model
    real_model_id = get_model_id(model)
    assert real_model_id == model_ids


def test_model_meta(models: DB_MODEL_TYPE) -> None:
    assert models._meta


def test_model_app_label(models: DB_MODEL_TYPE) -> None:
    assert models._meta.app_label


def test_model_db_table(models: DB_MODEL_TYPE) -> None:
    assert models._meta.db_table


def test_document_meta(documents: DB_MODEL_TYPE) -> None:
    assert documents._meta


def test_document_allow_inheritance(documents: DB_MODEL_TYPE) -> None:
    assert documents._meta.get("allow_inheritance") is None, (
        "'allow_inheritance' is obsolete and must not be used"
    )


def test_document_strict(documents: DB_MODEL_TYPE) -> None:
    assert not documents._meta.get("strict", True), "Document must be declared as {'strict': False}"


def test_document_auto_create_index(documents: DB_MODEL_TYPE) -> None:
    assert not documents._meta.get("auto_create_index", True), (
        "Index autocreation must not be used (Use auto_create_index: False)"
    )
