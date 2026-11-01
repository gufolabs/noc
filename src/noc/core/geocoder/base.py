# ----------------------------------------------------------------------
# BaseGeocoder class
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any

# Third-party modules
from gufo.loader import Loader

# NOC modules
from noc.config import config
from noc.core.http.sync import HttpClient

from .errors import GeoCoderError


@dataclass
class GeoCoderResult:
    exact: bool
    query: str
    path: list[str]
    lon: float | None = None
    lat: float | None = None
    id: str | None = None
    address: str | None = None
    scope: str | None = None


class BaseGeocoder:
    name = None

    def __init__(self, *args, **kwargs) -> None:
        pass

    def forward(self, query: str, bounds=None) -> GeoCoderResult:
        """
        Forward lookup
        Args:
            query (str): Address as string
        Returns:
            GeoCoderResult or None
        """
        try:
            return next(self.iter_query(query, bounds))
        except StopIteration:
            return None

    def iter_query(self, query: str, bounds=None) -> Iterator[GeoCoderResult]:
        """
        Get list of probable address candidates
        Returns:
            Result of get list of probable address candidates.
        """
        raise NotImplementedError()

    def iter_recursive_query(self, query: str, bounds=None) -> Iterator[GeoCoderResult]:
        """
        Get list of all addresses within the query
        Returns:
            Result of get list of all addresses within the query.
        """
        yield from self.iter_query(query, bounds)

    def get(self, url: str) -> tuple[int, bytes]:
        """
        Perform get request
        Returns:
            Result of perform get request.
        """
        with HttpClient(
            timeout=60,
            allow_proxy=True,
            validate_cert=False,
        ) as client:
            code, _headers, body = client.get(url)
            if 200 <= code <= 299:
                return code, body
            raise GeoCoderError(f"HTTP Error {code}")

    @staticmethod
    def get_path(data, path):
        """
        Returns nested object referred by dot-separated path, or None
        Returns:
            Result of returns nested object referred by dot-separated path, or none.
        """
        o = data
        for p in path.split("."):
            if p in o:
                o = o[p]
            else:
                return None
        return o

    @staticmethod
    def maybe_float(f: Any) -> float | None:
        if isinstance(f, float):
            return f
        if f:
            return float(f)
        return None


geocoder_loader = Loader[type[BaseGeocoder]](
    bases=config.iter_customized_bases("noc.core.geocoder"),
    exclude=("base", "errors"),
)
