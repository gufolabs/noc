## Python imports must be organized into import groups

# Import Groups
## Scope

Python source files containing import declarations.

## Requirement

Import declarations **MUST** be organized into three ordered groups:

1. Python modules.
2. Third-party modules.
3. NOC modules.

The groups **MUST** appear in this order.

Each non-empty import group **MUST** contain a group comment.

Import groups **MUST** be separated by an empty line.

Import groups that contain no imports **MUST** be omitted.

The Python modules group **MUST** contain modules from the Python standard library only.

The Third-party modules group **MUST** contain external dependencies installed separately from the Python standard library.

The NOC modules group **MUST** contain modules provided by the NOC project.

Example:

```python
# Python modules
import argparse
import os

# Third-party modules
import setproctitle

# NOC modules
from noc.config import config
from noc.core.error import NOCError
```

## Why?

Separating imports by ownership makes dependencies visible and improves source code readability.

The grouping allows developers and automated tools to quickly distinguish Python standard library modules, external dependencies, and project-specific modules.