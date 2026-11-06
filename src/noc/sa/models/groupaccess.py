# ----------------------------------------------------------------------
# GroupAccess model
# ----------------------------------------------------------------------
# Copyright (C) 2007-2020 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.aaa.models.group import Group
from noc.core.model.base import NOCModel

from .administrativedomain import AdministrativeDomain


class GroupAccess(NOCModel):
    """
    Attributes:
        group: Group
    """

    class Meta:
        db_table = "sa_groupaccess"
        app_label = "sa"
        ordering = ["group"]

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    administrative_domain = models.ForeignKey(
        AdministrativeDomain, null=True, blank=True, on_delete=models.CASCADE
    )

    def __str__(self):
        r = [f"group={self.group.name}"]
        if self.administrative_domain:
            r.append(f"domain={self.administrative_domain.name}")
        return f"({', '.join(r)})"
