---
checks:
- id: non-utf8-files
  description: Source files not encoded as UTF-8
  target: 0
---

# Source File Encoding

## Scope

All text files stored in the project repository.

## Requirements

Text files **MUST** be encoded using UTF-8.

Files **SHOULD** use Unix (`LF`) line endings.

## Why?

Using a common encoding and line ending convention improves portability, collaboration and tool compatibility across different operating systems.