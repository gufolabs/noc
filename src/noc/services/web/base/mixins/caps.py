# ---------------------------------------------------------------------
# Caps API mixin
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Third-party modules
from django.http import HttpRequest

# NOC modules
from noc.inv.models.capability import Capability
from noc.sa.interfaces.base import (
    BooleanParameter,
    IntParameter,
    StringListParameter,
    StringParameter,
)

from ..api import api
from .base import WebAppHost


class CapsApiMixin:
    """
    Mixin that adds capability management API endpoints
    to application classes with capability support.
    """

    @api.get(r"^(?P<sid>[0-9a-f]{24})/caps/$", access="read")
    def api_get_caps(self: WebAppHost, request: HttpRequest, sid: str):
        """
        List object capabilities
        """
        try:
            o = self.queryset(request).get(**{self.pk: sid})
        except self.model.DoesNotExist:
            return self.response_not_found()
        r = []
        for c in o.iter_caps(include_default=True):
            caps = c.get_form()
            caps["object"] = str(o.id)
            r.append(caps)
        return sorted(r, key=lambda x: x["capability"])

    @api.put(
        r"^(?P<object_id>[^/]+)/capabilities/(?P<capabilities_id>[0-9a-f]{24})/$",
        access="capabilities",
        validate={
            "value": StringListParameter(strict=True)
            | StringParameter()
            | IntParameter()
            | BooleanParameter()
        },
    )
    def api_set_capabilities(
        self: WebAppHost, request: HttpRequest, object_id: str, capabilities_id: str, value
    ):
        """
        Set object capability value
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        capability = self.get_object_or_404(Capability, id=capabilities_id)
        if not capability.allow_manual:
            return self.render_json(
                {"status": False, "message": "Not allowed manual edit"}, status=403
            )
        try:
            o.set_caps(capability.name, value)
        except ValueError as e:
            return self.render_json({"status": False, "message": str(e)}, status=self.BAD_REQUEST)
        return {
            "status": True,
            "data": {
                "capability": capability.name,
                "id": str(capability.id),
                "object": str(o.id),
                "description": capability.description,
                "type": capability.type.value,
                "value": capability.clean_value(value),
                "source": "manual",
                "scope": "",
                "editor": capability.get_editor(),
            },
        }

    @api.delete(
        r"^(?P<object_id>[^/]+)/capabilities/(?P<capabilities_id>[0-9a-f]{24})/$",
        access="capabilities",
    )
    def api_reset_capabilities(
        self: WebAppHost, request: HttpRequest, object_id: str, capabilities_id: str
    ):
        """
        Reset object capability value
        """
        try:
            o = self.queryset(request).get(**{self.pk: object_id})
        except self.model.DoesNotExist:
            return self.response_not_found()
        capability = self.get_object_or_404(Capability, id=capabilities_id)
        if not capability.allow_manual:
            return self.render_json(
                {"status": False, "message": "Not allowed manual edit"}, status=403
            )
        o.reset_caps(capability.name, source="manual")
        return {"status": True}
