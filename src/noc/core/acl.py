# ----------------------------------------------------------------------
# ACL Address Checking implementation
# ----------------------------------------------------------------------
# Copyright (C) 2007-2019 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import socket
import struct
from collections.abc import Iterable, Iterator


def _iter_pairs(prefixes: Iterable[str]) -> Iterator[tuple[int, int]]:
    """
    Yield tuples of first, last addresses as integer
    Args:
        prefixes: Iterable of IPv4 prefixes
    Returns:
        yield (first, last)
    """
    for prefix in prefixes:
        p, mask = prefix.split("/")
        p = struct.unpack("!L", socket.inet_aton(p))[0]
        mask = int(mask)
        p_mask = ((1 << mask) - 1) << (32 - mask)
        b_mask = 0xFFFFFFFF ^ p_mask
        yield p & p_mask, p | b_mask


def match(prefixes: Iterable[str], ip: str) -> bool:
    """
    Check if ip is match against ACL
    Args:
        prefixes: Iterable of IPv4 prefixes
        ip: IPv4 address
    Returns:
        True if ip is in prefixes
    """
    a = struct.unpack("!L", socket.inet_aton(ip))[0]
    return any(f <= a <= l for f, l in _iter_pairs(prefixes))
