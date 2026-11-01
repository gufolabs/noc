# ----------------------------------------------------------------------
# display_hint render functions
# ----------------------------------------------------------------------
# Copyright (C) 2007-2023 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
from collections.abc import Callable

# NOC modules
from noc.core.comp import smart_text


def render_bin(oid: str, value: bytes) -> bytes:
    """
    Render raw binary
    Returns:
        Result of render raw binary.
    """
    return value


def render_utf8(oid: str, value: bytes) -> str:
    """
    Render as UTF-8 text. Ignore errors
    Returns:
        Result of render as utf-8 text. ignore errors.
    """
    return smart_text(value, errors="ignore")


def get_text_renderer(encoding: str | None = "utf-8") -> Callable[[str, bytes], str]:
    """
    Return text renderer for arbitrary encoding
    Returns:
        Result of return text renderer for arbitrary encoding.
    """

    def renderer(oid, value):
        return smart_text(value, errors="ignore", encoding=encoding)

    return renderer


def render_empty(oid: str, value: bytes) -> str:
    """
    Always render empty string
    Returns:
        Result of always render empty string.
    """
    return ""


def render_mac(oid: str, value: bytes) -> str:
    """
    Render 6 octets as MAC address. Render empty string on length mismatch
    Returns:
        Result of render 6 octets as mac address. render empty string on length mismatch.
    """
    if len(value) != 6:
        return ""
    return "{:02X}:{:02X}:{:02X}:{:02X}:{:02X}:{:02X}".format(*tuple(value))


def render_IPV6(oid: str, value: bytes) -> str:
    """
    Render 16 octets as ip address V6. Render empty string on length mismatch
    Returns:
        Result of render 16 octets as ip address v6. render empty string on length mismatch.
    """
    if len(value) != 16:
        return ""
    return "{:02X}{:02X}:{:02X}{:02X}:{:02X}{:02X}:{:02X}{:02X}:{:02X}{:02X}:{:02X}{:02X}:{:02X}{:02X}:{:02X}{:02X}".format(
        *tuple(value)
    )


def get_string_renderer(v: str) -> Callable[[str, bytes], str]:
    """
    Always renders arbitrary string
    Returns:
        Result of always renders arbitrary string.
    """

    def renderer(oid, value):
        return v

    return renderer
