# ---------------------------------------------------------------------
# Web application mixin host protocol
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
from typing import Any, Protocol, runtime_checkable

# Third-party modules
from django.http import HttpRequest, HttpResponse


@runtime_checkable
class WebAppHost(Protocol):
    """
    Protocol for web application classes that can use base mixins.

    Web application classes (``ExtApplication`` and its subclasses)
    satisfy this protocol.
    """

    pk: str
    model: Any
    BAD_REQUEST: int

    def queryset(self, request: HttpRequest, query: str | None = None) -> Any: ...

    def get_object_or_404(self, model: type, *args: Any, **kwargs: Any) -> Any: ...

    def render_json(
        self,
        obj: object,
        *,
        status: int = 200,
        headers: dict[str, Any] | None = None,
    ) -> HttpResponse: ...

    def response_not_found(self, text: str | None = None) -> HttpResponse: ...
