# ----------------------------------------------------------------------
# Test __str__ method
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
import pytest

# NOC modules
from .util import get_models, get_documents


@pytest.mark.parametrize("model", get_models())
def test_model_str(model, database):
    for o in model.objects.all():
        s = str(o)
        assert s
        assert isinstance(s, str)


@pytest.mark.parametrize("model", get_documents())
def test_document_str(model, database):
    for o in model.objects.all():
        s = str(o)
        assert isinstance(s, str)
