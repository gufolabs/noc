# ---------------------------------------------------------------------
# Language model
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
    check=[
        ("kb.KBEntry", "language"),
        ("kb.KBEntryTemplate", "language"),
    ]
)
class Language(NOCModel):
    """
    Language

    Attributes:
        name: Name
        native_name: Native Name
        is_active: Is Active
    """

    class Meta:
        app_label = "main"
        db_table = "main_language"
        ordering = ["name"]

    name = models.CharField(max_length=32, unique=True)
    native_name = models.CharField(max_length=32)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name
