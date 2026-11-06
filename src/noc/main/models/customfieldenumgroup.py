# ---------------------------------------------------------------------
# CustomFieldEnumGroup model
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.model.decorator import on_delete_check


@on_delete_check(
    check=[("main.CustomField", "enum_group"), ("main.CustomFieldEnumValue", "enum_group")]
)
class CustomFieldEnumGroup(NOCModel):
    """
    Enumeration groups for custom fields

    Attributes:
        name: Name
        is_active: Is Active
        description: Description
    """

    class Meta:
        verbose_name = "Enum Group"
        verbose_name_plural = "Enum Groups"
        db_table = "main_customfieldenumgroup"
        app_label = "main"

    name = models.CharField(max_length=128, unique=True)
    is_active = models.BooleanField(default=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
