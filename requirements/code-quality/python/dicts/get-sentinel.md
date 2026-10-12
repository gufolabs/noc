## Dictionary get operations must use SENTINEL for missing values

### Scope

Python code using `dict.get()` where a missing dictionary key must be distinguished from an existing value.

### Requirement

Code **MUST** use the project-defined `SENTINEL` object as the default value of `dict.get()` when the absence of a key must be distinguished from a stored value.

Local sentinel objects **MUST NOT** be created.

Example:

Valid:

```python
from noc.core.typing import SENTINEL

value = data.get(key, SENTINEL)

if value is SENTINEL:
    ...
```

Invalid:
```python
_missing = object()

value = data.get(key, _missing)

if value is _missing:
    ...
```

Invalud
```python
value = data.get(key)

if value is None:
    ...
```

## Why?

A shared sentinel object provides a consistent way to represent missing dictionary values across the project.

Using SENTINEL avoids ambiguity between a missing key and a key containing a valid value such as None, False, or 0.

A single project-wide sentinel improves code readability, simplifies reviews, and allows reliable identity checks using the is operator.
