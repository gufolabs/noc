# Wildcards Import Usage

## Scope

Python source files containing import declarations.

## Requirement

Wildcard imports **MUST NOT** be used.

The `*` syntax in import declarations is prohibited.

Example:

Invalid:

```python
from module import *
```

Valid:
```python
from module import ClassName, function_name
```

## Why?

Explicit imports make dependencies visible and prevent unexpected namespace changes.

Wildcard imports hide imported entities, make code harder to analyze, and may introduce name conflicts.