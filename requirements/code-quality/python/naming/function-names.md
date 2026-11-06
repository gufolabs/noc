# Python function names must follow naming conventions

## Scope

Python functions and methods.

## Requirement

Function and method names **MUST** be written in lowercase and use underscores (`_`) as word separators.

Private functions and methods intended for internal use only **MUST** start with an underscore (`_`).

Examples:

Valid:

```python
def get_user_name() -> str:
    ...

def calculate_retry_count() -> int:
    ...

def _load_configuration() -> dict:
    ...
```

Invalid:

```
def getUserName() -> str:
    ...

def CalculateRetryCount() -> int:
    ...

def loadConfiguration() -> dict:
    ...
```

## Why?

Consistent function naming improves code readability and makes the purpose of functions easier to understand.

Using lowercase names with underscores follows the Python naming convention and provides a clear distinction from classes and other code elements.

The underscore prefix makes internal functions and methods explicit and helps developers identify implementation details that are not intended for external use.