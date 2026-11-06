# ---------------------------------------------------------------------
# EventTrigger
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.db import models

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.model.fields import DocumentReferenceField
from noc.inv.models.resourcegroup import ResourceGroup
from noc.main.models.notificationgroup import NotificationGroup
from noc.main.models.template import Template
from noc.main.models.timepattern import TimePattern


class EventTrigger(NOCModel):
    """
    Attributes:
        name: Name
        is_enabled: Is Enabled
        description: Description
        event_class_re: Event class RE
        condition: Condition
        handler: Handler
    """

    class Meta:
        db_table = "fm_eventtrigger"
        app_label = "fm"
        verbose_name = "Event Trigger"
        verbose_name_plural = "Event Triggers"

    name = models.CharField(max_length=64, unique=True)
    is_enabled = models.BooleanField(default=True)
    description = models.CharField(max_length=256, null=True, blank=True)
    event_class_re = models.CharField(max_length=256)
    condition = models.CharField(max_length=256, default="True")
    time_pattern = models.ForeignKey(
        TimePattern, verbose_name="Time Pattern", null=True, blank=True, on_delete=models.CASCADE
    )
    resource_group = DocumentReferenceField(ResourceGroup, null=True, blank=True)
    notification_group = models.ForeignKey(
        NotificationGroup,
        verbose_name="Notification Group",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    template = models.ForeignKey(
        Template, verbose_name="Template", null=True, blank=True, on_delete=models.CASCADE
    )
    handler = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return f"{self.event_class_re} <<<{self.condition}>>>"
