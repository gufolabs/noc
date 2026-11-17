# ----------------------------------------------------------------------
# BaseETLModel
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections.abc import Iterable
from itertools import zip_longest
from types import UnionType
from typing import Any, Union, get_args, get_origin

# Third-party modules
from gufo.loader import Loader
from pydantic import BaseModel as _BaseModel
from pydantic import ConfigDict
from pydantic.fields import FieldInfo

# NOC modules
from noc.config import config

from .typing import Reference


class BaseModel(_BaseModel):
    id: str

    model_config = ConfigDict(arbitrary_types_allowed=True)

    # List of legacy fields in sequental order
    _csv_fields = []

    @staticmethod
    def _get_reference_type(annotation: Any) -> type | None:
        """
        Get the target model type from a Reference annotation.

        Supports both direct Reference[T] and optional Reference[T]
        annotations (Union and PEP 604 union syntax).

        Args:
            annotation: Field type annotation.

        Returns:
            Referenced model type or None if annotation is not a reference.
        """
        origin = get_origin(annotation)
        if origin is Reference:
            return get_args(annotation)[0]
        if origin in (Union, UnionType):
            for arg in get_args(annotation):
                if get_origin(arg) is Reference:
                    return get_args(arg)[0]
        return None

    @classmethod
    def is_reference(cls, field: FieldInfo) -> bool:
        """
        Check whether field annotation represents a Reference.

        Args:
            field: Pydantic field definition.

        Returns:
            True if the field is a reference, False otherwise.
        """
        return cls._get_reference_type(field.annotation) is not None

    @classmethod
    def from_iter(cls, value: Iterable[Any]) -> BaseModel:
        """
        Convert tuple or list from legacy CSV to BaseModel instance
        Returns:
            Result of convert tuple or list from legacy csv to basemodel instance.
        """
        return cls(**{fn: val for fn, val in zip_longest(cls._csv_fields.default, value) if fn})

    @classmethod
    def get_mapped_fields(cls) -> dict[str, str]:
        """
        Get mapping of reference fields to their target model names.

        Returns:
            Dictionary mapping field names to lowercase referenced model names.
        """

        return {
            fn: ref.__name__.lower()
            for fn, f in cls.model_fields.items()
            if cls.is_reference(f) and (ref := cls._get_reference_type(f.annotation)) is not None
        }


etl_model_loader = Loader[type[BaseModel]](
    bases=config.iter_customized_bases("noc.core.etl.models"),
    exclude=("base",),
)
