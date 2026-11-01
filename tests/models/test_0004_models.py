# ----------------------------------------------------------------------
# Test models fields
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db.models import BooleanField
from django.db.models.fields import NOT_PROVIDED

# NOC modules
from noc.models import DB_MODEL_TYPE, get_model_id


def test_boolean_defaults(models: DB_MODEL_TYPE) -> None:
    for field in models._meta.fields:
        if not isinstance(field, BooleanField):
            continue
        assert field.default is not None
        assert field.default != NOT_PROVIDED, (
            f"BooleanField default for {get_model_id(models)}.{field.name} "
            "must be set to either True or False"
        )


def test_tucked_pants(models: DB_MODEL_TYPE) -> None:
    assert hasattr(models, "_tucked_pants"), "Model must be subclass of NOCModel"
