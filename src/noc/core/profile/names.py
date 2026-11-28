# ----------------------------------------------------------------------
# Profile name and module name mapping
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

# mangle_profile_name maps a profile name to a single flat adapter module
# name (layout "adapters/<flat>"). Collision caveat: names that differ only
# in a "-" vs "_" (e.g. "A.B-C" and "A.B_C") mangle to the same name; such
# profiles must not coexist. Resolve by choosing distinct names.

# Python modules
import re


def mangle_profile_name(name: str) -> str:
    """
    Map a profile name to a flat adapter module name.

    Rules:
    - each dot-separated segment is lowercased;
    - every character outside [a-z0-9] becomes "_"; consecutive such
      characters collapse into a single "_";
    - segments are joined with "__";
    - a leading digit is prefixed with "_"; a leading "_" is prefixed
      with another "_" (so it is distinguishable from a digit prefix).

    Examples:
        "Cisco.IOS"          -> "cisco__ios"
        "3Com.4500"          -> "_3com__4500"
        "IRE-Polus.Horizon"  -> "ire_polus__horizon"

    Args:
        name: Profile name, e.g. "Cisco.IOS" (any dot depth).

    Returns:
        Flat module name safe to use in a Python import.
    """
    flat = "__".join(re.sub(r"[^a-z0-9]+", "_", segment.lower()) for segment in name.split("."))
    if flat[:1].isdigit() or flat.startswith("_"):
        flat = "_" + flat
    return flat
