# ---------------------------------------------------------------------
# CustomFieldEnumValue model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel

from .customfieldenumgroup import CustomFieldEnumGroup


class CustomFieldEnumValue(NOCModel):
    """
    Enumeration groups values

    Attributes:
        is_active: Is Active
        key: Key
        value: Value
    """

    class Meta:
        verbose_name = "Enum Group Value"
        verbose_name_plural = "Enum Group Values"
        db_table = "main_customfieldenumvalue"
        app_label = "main"
        unique_together = [("enum_group", "key")]

    enum_group = models.ForeignKey(
        CustomFieldEnumGroup,
        verbose_name="Enum Group",
        related_name="enumvalue_set",
        on_delete=models.CASCADE,
    )
    is_active = models.BooleanField(default=True)
    key = models.CharField(max_length=256)
    value = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.enum_group.name}@{self.key}:{self.value}"
