# ---------------------------------------------------------------------
# AlarmTrigger
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


class AlarmTrigger(NOCModel):
    """
    Attributes:
        name: Name
        is_enabled: Is Enabled
        description: Description
        alarm_class_re: Alarm class RE
        condition: Condition
        handler: Handler
        time_pattern: Time Pattern
        notification_group: Notification Group
        template: Template
    """

    class Meta:
        db_table = "fm_alarmtrigger"
        app_label = "fm"

    name = models.CharField(max_length=64, unique=True)
    is_enabled = models.BooleanField(default=True)
    description = models.CharField(max_length=256, null=True, blank=True)
    alarm_class_re = models.CharField(max_length=256)
    condition = models.CharField(max_length=256, default="True")
    time_pattern = models.ForeignKey(TimePattern, null=True, blank=True, on_delete=models.CASCADE)
    resource_group = DocumentReferenceField(ResourceGroup, null=True, blank=True)
    notification_group = models.ForeignKey(
        NotificationGroup,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    template = models.ForeignKey(Template, null=True, blank=True, on_delete=models.CASCADE)
    handler = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return f"{self.alarm_class_re} <<<{self.condition}>>>"
