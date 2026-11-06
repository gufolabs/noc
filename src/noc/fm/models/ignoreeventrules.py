# ---------------------------------------------------------------------
# FM module database models
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel


class IgnoreEventRules(NOCModel):
    """
    Attributes:
        name: Name
        left_re: Left RE
        right_re: Right Re
        is_active: Is Active
        description: Description
    """

    class Meta:
        app_label = "fm"
        db_table = "fm_ignoreeventrules"
        unique_together = [("left_re", "right_re")]

    name = models.CharField(max_length=64, unique=True)
    left_re = models.CharField(max_length=256)
    right_re = models.CharField(max_length=256)
    is_active = models.BooleanField(default=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.left_re}, {self.right_re})"
