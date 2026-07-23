# Python variable names must follow naming conventions

## Scope

Python variables.

## Requirement

Variable names **MUST** be written in lowercase and use underscores (`_`) as word separators.

Constant names **MUST** be written in uppercase and use underscores (`_`) as word separators.

Examples:

Valid:

```python
user_name = "admin"
max_retry_count = 5

DEFAULT_TIMEOUT = 30
MAX_CONNECTIONS = 100
```

Invalid:

```python
userName = "admin"
UserName = "admin"

defaultTimeout = 30
MaxConnections = 100
```

## Why?

Consistent variable naming improves code readability and makes the purpose and lifetime of values easier to understand.

Using different naming conventions for variables and constants allows developers to quickly identify values that are expected to remain unchanged.