#!/usr/bin/env python3
# ----------------------------------------------------------------------
# print-files script
# ----------------------------------------------------------------------
# Copyright (C) 2007-2026 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

"""Print all files and directories specified by arguments."""

# Python modules
import argparse
from pathlib import Path
from typing import Iterable
import sys

HEADER_LEN = 72
NO_NEWLINE_MARKER = r"\ No newline at end of file"  # backslash is to match git output
SAFE_SUFFIXES = {".py", ".js", ".ts", ".yml", ".yaml", ".json", ".md", ".css", ".html", ".txt"}


def iter_files(paths: Iterable[str], exclude: Iterable[str]) -> Iterable[Path]:
    def is_safe(path: Path) -> bool:
        return path.is_file() and path.suffix in SAFE_SUFFIXES

    def is_excluded(path: Path) -> bool:
        return any(path == exclude or exclude in path.parents for exclude in excludes)

    excludes = [Path(p) for p in exclude]
    for arg in paths:
        path = Path(arg)
        if is_excluded(path):
            continue
        if path.is_dir():
            for p in path.rglob("*"):
                if is_excluded(p):
                    continue
                if is_safe(p):
                    yield p
        elif is_safe(path):
            yield path


def main(*args: str) -> None:
    parser = argparse.ArgumentParser(
        description="Print all files and directories specified by arguments.",
    )
    parser.add_argument(
        "paths",
        nargs="*",
        help="files and directories to print",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        help="file or directory name to exclude; may be specified multiple times",
    )
    options = parser.parse_args(args)

    paths = options.paths or (str(Path.cwd()),)
    for path in iter_files(paths, exclude=options.exclude):
        header = f"===[ File: {path} ]"
        if len(header) < HEADER_LEN:
            header += "=" * (HEADER_LEN - len(header))
        content = path.read_text()
        has_trailing_newline = content.endswith("\n")
        print(header)
        print(content, end="")
        print()
        if not has_trailing_newline:
            print(NO_NEWLINE_MARKER)


if __name__ == "__main__":
    main(*sys.argv[1:])
