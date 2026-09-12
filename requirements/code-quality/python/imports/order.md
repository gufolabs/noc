# Import Order

## Scope

Import declarations inside Python source files.

### Requirement

Imports inside each import group **MUST** be sorted in alphanumeric order.

Import declarations **MUST** be ordered line by line.

Imported entities inside a single `from` import declaration **MUST** be sorted in alphanumeric order.

Example:

```python
from typing import Any, Callable, Iterable, NoReturn
```

## Why?

Consistent import ordering improves readability and simplifies maintenance.

Alphabetical ordering makes duplicate imports, missing dependencies, and unnecessary changes easier to identify.