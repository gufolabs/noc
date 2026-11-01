# ----------------------------------------------------------------------
# Test database information
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from dataclasses import dataclass
from functools import cached_property

# NOC modules
from noc.models import DB_MODEL_TYPE, get_model, is_document, iter_model_id


@dataclass(frozen=True)
class DatabaseInfo:
    """Information about the initialized test database and its model registry."""

    @cached_property
    def models_by_id(self) -> dict[str, DB_MODEL_TYPE]:
        """Return models indexed by their registry ID."""
        return {model_id: get_model(model_id) for model_id in iter_model_id()}

    @cached_property
    def all_models(self) -> tuple[DB_MODEL_TYPE, ...]:
        """Return all registered model and document classes."""
        return tuple(self.models_by_id.values())

    @cached_property
    def models(self) -> tuple[DB_MODEL_TYPE, ...]:
        """Return registered Django model classes."""
        return tuple(model for model in self.all_models if not is_document(model))

    @cached_property
    def documents(self) -> tuple[DB_MODEL_TYPE, ...]:
        """Return registered Mongo document classes."""
        return tuple(model for model in self.all_models if is_document(model))


database_info = DatabaseInfo()
