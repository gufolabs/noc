# ----------------------------------------------------------------------
# Profile name and module name mapping
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# Profile names may start with a digit (e.g. "3Com.4500"). Such names are
# not valid Python module names, so the backing module directories are
# stored with an underscore prefix (e.g. "sa/profiles/_3Com/_4500/").
# Profile names in the database and UI remain unmangled.


def mangle_profile_module_name(name: str) -> str:
    """
    Map profile name to module name.
    Each dotted component starting with a digit is prefixed with underscore.
    Example: "3Com.4500" -> "_3Com._4500"
    """
    return ".".join(("_" + c if c[:1].isdigit() else c) for c in name.split("."))


def unmangle_profile_module_name(name: str) -> str:
    """
    Reverse mapping for mangle_profile_module_name.
    Strips leading underscore from components where it is followed by a digit.
    Example: "_3Com._4500" -> "3Com.4500"
    """
    return ".".join(
        c[1:] if len(c) > 1 and c.startswith("_") and c[1].isdigit() else c for c in name.split(".")
    )
