# Exception suppression must use contextlib.suppress

## Scope

Python code that intentionally suppresses exceptions.

## Requirement

When an exception must be intentionally ignored, code **MUST** use `contextlib.suppress`.

Using an empty `except` block with `pass` to suppress exceptions **MUST NOT** be used.

Examples:

Valid:

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove(filename)
```

Invalid:

```python
try:
    os.remove(filename)
except FileNotFoundError:
    pass
```

## Why?

`contextlib.suppress` clearly expresses the intention to ignore specific exceptions.

Using `suppress` reduces boilerplate code and makes exception handling easier to read and review.

A dedicated construct also prevents accidentally hiding unrelated exceptions that are not intended to be ignored.