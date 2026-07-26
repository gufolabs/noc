## Abstract base classes must use ABC

### Scope

Python classes defining abstract interfaces or base classes.

### Requirement

Abstract base classes **MUST** inherit from `abc.ABC`.

Abstract methods **MUST** be declared using `abc.abstractmethod`.

Example:

```python
from abc import ABC, abstractmethod


class BaseTransport(ABC):
    """Base transport interface."""

    @abstractmethod
    def send(self, data: bytes) -> None:
        """Send data."""
        ...
```

## Why?

Explicit abstract base classes make interfaces clear and enforce implementation contracts.

Using ABC and abstractmethod allows Python to detect incomplete implementations early and provides better support for static analysis tools.