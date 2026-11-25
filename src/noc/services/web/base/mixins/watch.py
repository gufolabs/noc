# ---------------------------------------------------------------------
# Watch mixin
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.aaa.models.user import User
from noc.core.mx import get_subscriber_id
from noc.crm.models.subscriber import Subscriber
from noc.main.models.notificationgroup import NotificationGroup
from noc.sa.interfaces.base import BooleanParameter, DictListParameter, StringParameter

from ..api import api
from .base import WebAppHost


def _subscription_to_dict(s, o, user):
    """
    Convert subscription to dict representation
    """
    si = get_subscriber_id(user)
    settings = o.get_subscription_setting(user)
    r = {
        "source": "S" if not s.remote_system else str(s.remote_system.name),
        "remote_system": None if not s.remote_system else str(s.remote_system.id),
        "object": str(o.id),
        "notification_group": str(s.notification_group.id),
        "notification_group__label": str(s.notification_group.name),
        "users": [],
        "crm_users": [],
        "me_subscribe": si in s.watchers,
        "me_suppress": si in s.suppresses,
        "allow_subscribe": settings.allow_subscribe if settings else False,
        "allow_edit": False,
        "allow_suppress": settings.allow_subscribe if settings else False,
    }
    for w in s.get_watchers():
        if isinstance(w, User):
            r["users"].append({"user": str(w.id), "user__label": w.username, "suppress": False})
        else:
            r["crm_users"].append({"user": str(w.id), "user__label": w.name, "suppress": False})
    return r


class WatchMixin:
    """
    Mixin that adds notification subscription API endpoints
    to application classes.
    """

    @api.get(r"^(?P<object_id>[^/]+)/has_subscriptions/$", access="read")
    def api_check_object_subscriptions(self: WebAppHost, request: HttpRequest, object_id: str):
        """
        Check if the object has notification subscriptions
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        if NotificationGroup.get_object_subscriptions(o, user=request.user):
            ss = "me"
        elif NotificationGroup.get_object_subscriptions(o):
            ss = "group"
        else:
            ss = "no"
        return {"success": True, "subscription_to": ss}

    @api.get(r"^(?P<object_id>[^/]+)/object_subscription/$", access="read")
    def api_object_subscriptions(self: WebAppHost, request: HttpRequest, object_id: str):
        """
        List object notification subscriptions
        """
        r = []
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        processed = set()
        for s in NotificationGroup.iter_object_subscription_settings(o):
            r.append(_subscription_to_dict(s, o, request.user))
            processed.add(str(s.notification_group.id))
        for g in NotificationGroup.objects.filter():
            if str(g.id) in processed:
                continue
            settings = g.get_subscription_setting(request.user)
            r.append(
                {
                    "source": "G",
                    "remote_system": None,
                    "object": str(o.id),
                    "notification_group": str(g.id),
                    "notification_group__label": str(g.name),
                    "users": [],
                    "crm_users": [],
                    "me_subscribe": False,  # User Group settings
                    "me_suppress": False,  # User Group settings
                    "allow_edit": False,
                    "allow_subscribe": settings.allow_subscribe if settings else False,
                    "allow_suppress": settings.allow_subscribe if settings else False,
                }
            )
        return r

    @api.post(
        r"^(?P<object_id>[^/]+)/object_subscription/(?P<group_id>\d+)/update/$",
        access="update_subscription",
        validate={
            "users": DictListParameter(
                attrs={
                    "user": StringParameter(required=True),
                    "suppress": BooleanParameter(required=False),
                },
                required=False,
            ),
            "crm_users": DictListParameter(
                attrs={
                    "user": StringParameter(required=True),
                    "suppress": BooleanParameter(required=False),
                },
                required=False,
            ),
        },
    )
    def api_update_object_subscriptions(
        self: WebAppHost,
        request: HttpRequest,
        object_id: str,
        group_id: str,
        users=None,
        crm_users=None,
    ):
        """
        Update group subscription watchers
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        group = self.get_object_or_404(NotificationGroup, id=group_id)
        watchers: list[User | Subscriber] = []
        suppresses: list[User | Subscriber] = []
        if users is not None:
            for c in users:
                u = User.get_by_id(int(c["user"]))
                if u and c["suppress"]:
                    suppresses.append(u)
                elif u:
                    watchers.append(u)
        if crm_users is not None:
            for c in crm_users or []:
                su = Subscriber.get_by_id(c["user"])
                if su and c["suppress"]:
                    suppresses.append(su)
                elif su:
                    watchers.append(su)
        s = group.update_subscription(o, watchers=watchers, suppresses=suppresses)
        return {"success": True, "data": _subscription_to_dict(s, o, request.user)}

    @api.post(
        r"^(?P<object_id>[^/]+)/object_subscription/(?P<group_id>\d+)/subscribe/$",
        access="update_subscription",
    )
    def api_subscribe_group(self: WebAppHost, request: HttpRequest, object_id: str, group_id: str):
        """
        Subscribe current user to object notifications
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        group = self.get_object_or_404(NotificationGroup, id=group_id)
        s = group.subscribe_object(o, user=request.user)
        return {"success": True, "data": _subscription_to_dict(s, o, request.user)}

    @api.post(
        r"^(?P<object_id>[^/]+)/object_subscription/(?P<group_id>\d+)/unsubscribe/$",
        access="update_subscription",
    )
    def api_unsubscribe_group(
        self: WebAppHost, request: HttpRequest, object_id: str, group_id: str
    ):
        """
        Unsubscribe current user from object notifications
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        group = self.get_object_or_404(NotificationGroup, id=group_id)
        s = group.unsubscribe_object(o, user=request.user)
        if not s:
            return {"success": False, "message": "User not subscribe"}
        return {"success": True, "data": _subscription_to_dict(s, o, request.user)}

    @api.post(
        r"^(?P<object_id>[^/]+)/object_subscription/(?P<group_id>\d+)/suppress/$",
        access="update_subscription",
    )
    def api_suppress_group(self: WebAppHost, request: HttpRequest, object_id: str, group_id: str):
        """
        Suppress object notifications for current user
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        group = self.get_object_or_404(NotificationGroup, id=group_id)
        s = group.supress_object(o, user=request.user)
        if not s:
            return {"success": False, "message": "User not subscribe"}
        return {"success": True, "data": _subscription_to_dict(s, o, request.user)}
