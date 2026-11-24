# ----------------------------------------------------------------------
# Capabilities types
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, cast

# NOC modules
from noc.core.models.inputsources import InputSource
from noc.core.models.valuetype import ValueType

if TYPE_CHECKING:
    # NOC modules
    from noc.inv.models.capability import Capability


@dataclass(frozen=True)
class CapsConfig:
    allow_manual: bool = False
    default_value: Any | None = None
    ref_scope: str | None = None
    set_label: str | None = None
    required: bool = False
    expose_models: list[str] | None = None


@dataclass(frozen=True)
class CapsValue:
    capability: Capability
    value: Any
    source: InputSource
    scope: str | None = None
    config: CapsConfig = CapsConfig()

    def __str__(self) -> str:
        if self.scope:
            return f"{self.capability.name}@{self.scope} = {self.value}"
        return f"{self.capability.name} = {self.value}"

    @property
    def name(self) -> str:
        return self.capability.name or ""

    def set_value(self, value: Any) -> CapsValue:
        """Update value"""
        return CapsValue(
            capability=self.capability,
            value=value,
            source=self.source,
            scope=self.scope,
        )

    def get_form(self, allow_manual: bool = False) -> dict[str, Any]:
        """Render Caps Form"""
        return {
            "capability": self.capability.name,
            "id": str(self.capability.pk),
            # "object": str(o.id),
            "description": self.capability.description,
            "type": self.capability.type.value,
            "value": self.value,
            "source": self.source,
            "scope": self.scope or "",
            "editor": self.capability.get_editor() if self.config.allow_manual else None,
        }

    def get_labels(self) -> list[str] | None:
        """Get caps Label"""
        if not self.config.set_label:
            return None
        if self.capability.multi:
            values = cast(list[str], self.value)
            return [f"{self.config.set_label[:-1]}{v}" for v in values]
        if self.capability.type == ValueType.BOOL:
            if not self.value or self.config.set_label[-1] == "*":
                return None
            return [self.config.set_label]
        return [f"{self.config.set_label[:-1]}{self.value}"]
