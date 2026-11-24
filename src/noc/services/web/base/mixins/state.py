# ---------------------------------------------------------------------
# State mixin
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.wf.models.transition import Transition

from ..api import api
from .base import WebAppHost


class StateMixin:
    """
    Mixin that adds workflow state transitions endpoints
    to application classes with workflow state support.
    """

    wf_state = True

    @api.get(r"^(?P<object_id>[^/]+)/transitions/$", access="read")
    def api_transitions(self: WebAppHost, request: HttpRequest, object_id: str):
        """
        List available manual transitions for the object state
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        r = []
        for t in Transition.objects.filter(from_state=o.state, enable_manual=True):
            r.append(
                {
                    "id": str(t.id),
                    "label": str(t.label or ""),
                    "description": str(t.description or ""),
                    "to_state": str(t.to_state.id),
                    "to_state__label": str(t.to_state.name),
                }
            )
        return r

    @api.post(
        r"^(?P<object_id>[^/]+)/transitions/(?P<transition_id>[0-9a-f]{24})/$",
        access="write",
    )
    def api_make_transition(
        self: WebAppHost, request: HttpRequest, object_id: str, transition_id: str
    ):
        """
        Execute manual state transition
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        try:
            t = Transition.objects.get(from_state=o.state, enable_manual=True, id=transition_id)
        except Transition.DoesNotExist:
            return self.response_not_found()
        o.fire_transition(t)
        return {"state": str(o.state.id), "state__label": str(o.state)}
