# ----------------------------------------------------------------------
# ObjectNotification
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import os

# Third-party modules
from django.db import models
from django.template import Context, Template

# NOC modules
from noc.core.model.base import NOCModel
from noc.core.model.fields import DocumentReferenceField
from noc.inv.models.resourcegroup import ResourceGroup
from noc.main.models.notificationgroup import NotificationGroup

_tpl_cache = {}  # name -> template instance


def render_template(name, context=None):
    """
    Render template
    :return:
    """

    def get_path(name):
        local_path = os.path.join("local", "templates", name)
        if os.path.exists(local_path):
            return local_path
        default_path = os.path.join("templates", name)
        if os.path.exists(default_path):
            return default_path
        return None

    # Get cached template
    if name not in _tpl_cache:
        path = get_path(name)
        if path:
            with open(path) as f:
                _tpl_cache[name] = Template(f.read())
        else:
            _tpl_cache[name] = None
    tpl = _tpl_cache[name]
    if tpl:
        return tpl.render(Context(context or {}))
    return None


def render_message(name, context=None):
    """
    Render template. Treat first Subject: line as a subject.
    Returns subject, body tuple
    :return: subject, body tuple
    """

    def strip_leading_newlines(lines):
        lc = lines[:]
        while lc and not lc[0].strip():
            lc.pop(0)
        return lc

    msg = render_template(name, context)
    if not msg:
        return None, None  # No template
    ln = strip_leading_newlines(msg.splitlines())
    if ln and ln[0].startswith("Subject"):
        subject = ln.pop(0)[8:].strip()
        body = "\n".join(strip_leading_newlines(ln[1:]))
        return subject, body
    return None, "\n".join(ln)


class ObjectNotification(NOCModel):
    """
    Attributes:
        config_changed: Config changed
        alarm_risen: Alarm risen
        alarm_reopened: Alarm reopened
        alarm_cleared: Alarm cleared
        alarm_commented: Alarm commented
        new: New
        deleted: Deleted
        version_changed: Version changed
        interface_changed: Interface changed
        script_failed: Script failed
        config_policy_violation: Config policy violation
        notification_group: Notification Group
    """

    class Meta:
        db_table = "sa_objectnotification"
        app_label = "sa"

    resource_group = DocumentReferenceField(ResourceGroup)
    notification_group = models.ForeignKey(NotificationGroup, on_delete=models.CASCADE)
    # Events
    config_changed = models.BooleanField(default=False)
    alarm_risen = models.BooleanField(default=False)
    alarm_reopened = models.BooleanField(default=False)
    alarm_cleared = models.BooleanField(default=False)
    alarm_commented = models.BooleanField(default=False)
    new = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    version_changed = models.BooleanField(default=False)
    interface_changed = models.BooleanField(default=False)
    script_failed = models.BooleanField(default=False)
    config_policy_violation = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.resource_group}, {self.notification_group}"

    @classmethod
    def render_message(cls, event_id, context):
        """
        Render template for event
        :return: subject, body tuple
        """
        # Render template
        template = f"object/{event_id}.html"
        return render_message(template, context)
