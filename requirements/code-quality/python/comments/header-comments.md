## Python source files must use standard header comments

### Scope

Python source files except empty `__init__.py` files.

### Requirement

Python source files **MUST** contain a standard file header comment.

The header **MUST** follow the project-defined format.

Example:

```python
# ---------------------------------------------------------------------
# <description>
# ---------------------------------------------------------------------
# Copyright (C) 2007-<year> The NOC Project
# See LICENSE for details
# ---------------------------------------------------------------------
```

Where:
- `<description>` - a short one-line description of the module purpose.
- `<year>` - year of the last modification of the module.

## Why?

Standard file headers provide basic module metadata directly in the source file.

The header identifies the project the file belongs to, defines copyright information, and provides a short introduction to the module purpose.

This information is not part of the module documentation and **MUST NOT** be included in docstrings. File headers are source code metadata and remain as comments in the module.