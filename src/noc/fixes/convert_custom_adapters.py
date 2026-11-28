# ---------------------------------------------------------------------
# Convert custom profiles from the legacy sa/profiles layout to the
# flat adapters layout
# ---------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------

# Python modules
import ast
import re
import shutil
from importlib.resources import files
from pathlib import Path
from typing import cast

# NOC modules
from noc.core.profile.names import mangle_profile_name


def _legacy_unmangle(name: str) -> str:
    """
    Reverse the legacy per-segment mangling used for old
    ``sa/profiles/<vendor>/<software>`` directory names: a leading
    ``_`` before a digit was the only mangling applied (e.g.
    ``_3Com/_4500`` -> ``3Com.4500``).

    The new layout mangles names in a lossy way (e.g. ``-`` and ``_``
    both map to ``_``), so the original-case directory path is the only
    lossless source for the logical profile name.
    """
    return name[1:] if len(name) > 1 and name.startswith("_") and name[1].isdigit() else name


def _ensure_profile_name(profile_py: Path, name: str) -> None:
    """
    Ensure the profile class in profile.py declares ``name = "<name>"``.

    The flat layout requires every profile class to carry an explicit
    name (enforced by the BaseProfile metaclass). Inserts the attribute
    into the first class that subclasses ``BaseProfile`` if it is not
    present.
    """
    text = profile_py.read_text()
    tree = ast.parse(text)
    kls = next(
        (
            node
            for node in ast.walk(tree)
            if isinstance(node, ast.ClassDef)
            and any(isinstance(b, ast.Name) and b.id == "BaseProfile" for b in node.bases)
        ),
        None,
    )
    if kls is None:
        raise ValueError(f"{profile_py}: no BaseProfile subclass found")
    for stmt in kls.body:
        if isinstance(stmt, ast.Assign) and any(
            isinstance(t, ast.Name) and t.id == "name" for t in stmt.targets
        ):
            return  # name already present
    # Insert after the docstring (if any), otherwise after the first statement
    if (
        kls.body
        and isinstance(kls.body[0], ast.Expr)
        and isinstance(kls.body[0].value, ast.Constant)
        and isinstance(kls.body[0].value.value, str)
    ):
        idx = kls.body[0].end_lineno
    else:
        idx = kls.body[0].lineno - 1
    indent = " " * (kls.body[0].col_offset)
    lines = text.splitlines(keepends=True)
    lines.insert(cast(int, idx), f'{indent}name = "{name}"\n')
    profile_py.write_text("".join(lines))


def _report_leftovers(base: Path) -> None:
    """
    Warn about legacy ``sa.profiles`` references the fix could not map.

    References to built-in profiles (``noc.sa.profiles.Cisco.IOS.*``, ...)
    are not rewritten automatically: guessing the original profile name
    from a flat module path would be lossy, so unmapped references are
    left in place and reported for a manual fix (see ``./noc adapter mangle``).
    """
    left = re.compile(r"sa\.profiles[.\w-]*")
    found = 0
    for f in sorted(base.rglob("*.py")):
        text = f.read_text()
        for line_no, line in enumerate(text.splitlines(), 1):
            if m := left.search(line):
                found += 1
                print(
                    f"WARNING: {f}:{line_no}: unmapped legacy reference {m.group(0)!r}", flush=True
                )
    if found:
        print(
            f"WARNING: {found} legacy sa.profiles reference(s) left unmapped; "
            "fix them manually (see ./noc adapter mangle)",
            flush=True,
        )


def convert_base(base: str | Path) -> None:
    """
    Convert one custom root from the legacy layout to the flat layout.

    - moves ``<base>/sa/profiles/<vendor>/<software>`` to
      ``<base>/adapters/<mangled profile name>``;
    - rewrites legacy ``noc.sa.profiles.`` imports to the flat
      ``noc.adapters.<mangled>`` modules;
    - adds the required ``name`` attribute to profile classes;
    - removes the now-empty legacy directories.

    Idempotent and convergent: profiles already moved are skipped, and
    the post-move steps (import rewrite, name insertion, cleanup) also
    run on an already-moved tree, so an interrupted conversion can be
    repaired by rerunning the fix. Note: references to a profile that
    was moved by a previous (interrupted) run cannot be rewritten
    automatically, because the legacy name is not derivable from the
    flat directory name; they are reported by the leftover scan for a
    manual fix instead.
    """
    base = Path(base)
    legacy_root = base / "sa" / "profiles"
    if not legacy_root.is_dir():
        print(f"No legacy profile directory: {legacy_root}", flush=True)
    # 1. Collect the legacy profile directories
    moves: list[tuple[str, Path, Path]] = []
    claimed: set[str] = set()
    if legacy_root.is_dir():
        for vendor in sorted(legacy_root.iterdir()):
            if not vendor.is_dir():
                continue
            for sw in sorted(vendor.iterdir()):
                if not sw.is_dir():
                    continue
                name = f"{_legacy_unmangle(vendor.name)}.{_legacy_unmangle(sw.name)}"
                dst = base / "adapters" / mangle_profile_name(name)
                if (dst / "profile.py").is_file():
                    print(f"Skip already converted profile {name}", flush=True)
                    continue
                if dst.exists():
                    print(f"WARNING: destination exists, skip {name}: {dst}", flush=True)
                    continue
                if mangle_profile_name(name) in claimed:
                    print(f"WARNING: duplicate flat name, skip {name}: {dst}", flush=True)
                    continue
                claimed.add(mangle_profile_name(name))
                moves.append((name, sw, dst))
    if not moves:
        print("Nothing to convert", flush=True)
    # 2. Move the directories
    for name, src, dst in moves:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        print(f"Converted {name}: {src} -> {dst}", flush=True)
    # The post-move steps run whether or not anything was moved in this
    # run, so an interrupted conversion converges on re-run.
    adapters_dir = base / "adapters"
    if adapters_dir.is_dir():
        # 3. Rewrite legacy module references. In the legacy layout the
        # importable module path of a profile is its directory name with
        # non-identifier characters replaced by ``_`` (e.g. CERION.CER-ADV ->
        # CERION.CER_ADV); the destination flat name is mangle_profile_name(name).
        replacements: list[tuple[str, str]] = []
        for name, _, _ in moves:
            for old in {name, name.replace("-", "_")}:
                new = mangle_profile_name(name)
                if old != new and not any(o == old for o, _ in replacements):
                    replacements.append((old, new))
        # Generic scripts were historically imported from the vendor-level
        # "Generic" module; map both legacy forms unconditionally.
        for old in ("Generic", "Generic.Host"):
            new = mangle_profile_name("Generic.Host")
            if old != new and not any(o == old for o, _ in replacements):
                replacements.append((old, new))
        order = sorted(replacements, key=lambda p: len(p[0]), reverse=True)
        # Single atomic substitution: alternatives are longest-first; the
        # trailing check (no word/hyphen continuation) rejects a partial
        # match of a longer name while still allowing the trailing dot of
        # a ``<profile>.<module>`` import path.
        subs = re.compile(
            r"noc\.sa\.profiles\."
            "(" + "|".join(re.escape(old) for old, _ in order) + ")" + r"(?![\w-])"
        )
        newmap = dict(order)

        def _sub(m: re.Match) -> str:
            return f"noc.adapters.{newmap[m.group(1)]}"

        rewritten: set[str] = set()
        for f in sorted(adapters_dir.rglob("*.py")):
            text = f.read_text()
            orig = text
            text = subs.sub(_sub, text)
            if text != orig:
                f.write_text(text)
                rewritten.add(str(f))
        for path in sorted(rewritten):
            print(f"Rewrote imports in {path}", flush=True)
        # 4. Ensure the required name attribute in every adapter profile.
        # Newly moved profiles use their logical name; pre-existing ones
        # fall back to the flat directory name.
        for dst in sorted(adapters_dir.iterdir()):
            if not dst.is_dir():
                continue
            profile_py = dst / "profile.py"
            if not profile_py.is_file():
                continue
            name = next((n for n, _, d in moves if d == dst), dst.name)
            _ensure_profile_name(profile_py, name)
            print(f"Ensured name attribute in {profile_py}", flush=True)
        # 5. Report references the fix could not map automatically
        _report_leftovers(base)
    # 6. Remove the legacy tree bottom-up. A directory is removed only when
    # it holds nothing besides an empty __init__.py, so e.g. a custom
    # sa/interfaces (or a skipped conflicting profile) survives.
    for _, src, _ in moves:
        for d in (src, src.parent):
            if d.is_dir() and all(
                p.name == "__init__.py" and not p.stat().st_size for p in d.iterdir()
            ):
                (d / "__init__.py").unlink(missing_ok=True)
                d.rmdir()
    for d in (base / "sa" / "profiles", base / "sa"):
        if d.is_dir() and all(p.name == "__init__.py" for p in d.iterdir()):
            (d / "__init__.py").unlink(missing_ok=True)
            d.rmdir()


def fix() -> None:
    """Entry point for ``./noc fix apply convert_custom_adapters``."""
    # NOC modules
    from noc.config import config

    noc_base = str(files("noc"))
    for base in config.get_customized_paths():
        if not base:
            continue  # Empty element = the built-in noc package, shipped already converted
        if base == noc_base:
            continue
        print(f"Converting custom base {base} ...", flush=True)
        convert_base(base)
    print("Custom adapters conversion done", flush=True)
