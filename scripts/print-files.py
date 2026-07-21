#!/usr/bin/env python3
# ----------------------------------------------------------------------
# print-files script
# ----------------------------------------------------------------------
# Copyright (C) 2007-2025 The NOC Project
# See LICENSE for details
# ----------------------------------------------------------------------

"""Print all files and directories specified by arguments."""

# Python modules
from pathlib import Path
from typing import Iterable
import sys

HEADER_LEN = 72
NO_NEWLINE_MARKER = r"\ No newline at end of file"


def iter_files(paths: Iterable[str]) -> Iterable[Path]:
    for arg in paths:
        path = Path(arg)
        if path.is_dir():
            yield from (p for p in path.rglob("*") if p.is_file())
        elif path.is_file():
            yield path


def main(*args: str) -> None:
    paths = args if args else (str(Path.cwd()),)
    for path in iter_files(paths):
        header = f"===[ File: {path} ]"
        if len(header) < HEADER_LEN:
            header += "=" * (HEADER_LEN - len(header))
        content = path.read_text()
        has_trailing_newline = content.endswith("\n")
        print(header)
        print(content, end="")
        if has_trailing_newline:
            print()
        else:
            print()
            print(NO_NEWLINE_MARKER)


if __name__ == "__main__":
    main(*sys.argv[1:])
