# ---------------------------------------------------------------------
# Object notifications
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.main.models.notificationgroup import NotificationGroup
from noc.sa.models.administrativedomain import AdministrativeDomain

OBJECT_TYPES = ["config", "dns", "prefix-list", "rpsl"]
OBJECT_TYPE_CHOICES = [(x, x) for x in OBJECT_TYPES if x != "config"]


class ObjectNotify(NOCModel):
    """
    Attributes:
        type: Type
        notify_immediately: Notify Immediately
        notify_delayed: Notify Delayed
        administrative_domain: Administrative Domain
        notification_group: Notification Group
    """

    class Meta:
        app_label = "cm"
        db_table = "cm_objectnotify"

    type = models.CharField(max_length=16, choices=OBJECT_TYPE_CHOICES)
    administrative_domain = models.ForeignKey(
        AdministrativeDomain,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )
    notify_immediately = models.BooleanField(default=False)
    notify_delayed = models.BooleanField(default=False)
    notification_group = models.ForeignKey(NotificationGroup, on_delete=models.CASCADE)

    def __str__(self):
        return f"({self.type}, {self.administrative_domain}, {self.notification_group})"
