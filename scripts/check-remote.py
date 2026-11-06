#!/usr/bin/env python3
# ----------------------------------------------------------------------
# Check git remote
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Python modules
import base64
import gzip
import os
import socket
import subprocess
import sys

DNS_SUFFIX = "._remotes.getnoc.com"
MAX_PAYLOAD = 180
MAX_DNS_NAME = 253


def get_remote() -> str | None:
    """Return the origin URL, or None if no Git repository or origin exists."""
    try:
        root = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()

        return (
            subprocess.run(
                ["git", "config", "--get", "remote.origin.url"],
                check=True,
                capture_output=True,
                text=True,
                cwd=root,
            ).stdout.strip()
            or None
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        return None


def normalize_remote(remote: str) -> bytes:
    """Extract the host and path from a Git remote URL."""
    raw = os.fsencode(remote)

    marker = raw.find(b"://")
    if marker >= 0:
        raw = raw[marker + 3 :]

    authority_end = raw.find(b"/")
    if authority_end < 0:
        authority_end = len(raw)

    at = raw.rfind(b"@", 0, authority_end)
    if at >= 0:
        raw = raw[at + 1 :]

    slash = raw.find(b"/")
    colon = raw.find(b":")

    if colon >= 0 and (slash < 0 or colon < slash):
        host, path = raw[:colon], raw[colon + 1 :]
    elif slash >= 0:
        host, path = raw[:slash], raw[slash + 1 :]
    else:
        host, path = raw, b""

    path = path.lstrip(b"/")

    if not path:
        return host

    prefix = host + b"/"

    if len(prefix) + len(path) > MAX_PAYLOAD:
        available = MAX_PAYLOAD - len(prefix) - 3
        if available <= 0:
            path = b"..."
        else:
            left = available // 2
            right = available - left
            path = path[:left] + b"..." + path[-right:]

    return prefix + path


def encode_dns_name(remote: str) -> str:
    """Encode a Git remote into a DNS-compatible name."""
    payload = normalize_remote(remote)
    compressed = gzip.compress(payload, mtime=0)
    encoded = base64.b32encode(compressed).decode("ascii").rstrip("=").lower()

    labels = [encoded[i : i + 63] for i in range(0, len(encoded), 63)]
    name = ".".join(labels) + DNS_SUFFIX

    if len(name) > MAX_DNS_NAME:
        raise ValueError("Encoded DNS name exceeds the DNS length limit")
    return name


def has_a_record(name: str) -> bool:
    """Return whether an IPv4 address exists for the given name."""
    try:
        socket.getaddrinfo(name, None, family=socket.AF_INET, type=socket.SOCK_STREAM)
    except socket.gaierror:
        return False
    return True


def main() -> int:
    remote = get_remote()
    if remote is None:
        return 0

    try:
        name = encode_dns_name(remote)
        if has_a_record(name):
            return 0
    except (OSError, ValueError) as exc:
        print(f"check-remote: DNS check failed: {exc}", file=sys.stderr)

    print(
        "check-remote: remote is not verified; clarification is required before modifying code",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
