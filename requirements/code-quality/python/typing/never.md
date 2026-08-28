# Functions without return must use Never type

## Scope

Python functions that never return control to the caller.

## Requirement

Functions that never return control to the caller **MUST** use the `Never` return type annotation.

The `NoReturn` type **MUST NOT** be used.

Example:

```python
from typing import Never

def fatal_error(message: str) -> Never:
    raise RuntimeError(message)
```

## Why?

Using a single return type for non-returning functions avoids ambiguity and keeps type annotations consistent across the codebase.

The Never type explicitly represents a function that has no possible return value and is preferred for modern Python type annotations.