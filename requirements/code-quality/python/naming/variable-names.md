# Python variable names must follow naming conventions

## Scope

Python variables.

## Requirement

Variable names **MUST** be written in lowercase and use underscores (`_`) as word separators.

Constant names **MUST** be written in uppercase and use underscores (`_`) as word separators.

Variables that are intentionally unused or internal **SHOULD** start with an underscore (`_`).

Examples:

Valid:

```python
user_name = "admin"
max_retry_count = 5

DEFAULT_TIMEOUT = 30
MAX_CONNECTIONS = 100

_unused_value = calculate_result()

for _ in range(10):
    process()
```

Invalid:

```python
userName = "admin"
UserName = "admin"

defaultTimeout = 30
MaxConnections = 100

for i in range(10):
    process()
```

## Why?

Consistent variable naming improves code readability and makes the purpose and lifetime of values easier to understand.

Using different naming conventions for variables and constants allows developers to quickly identify values that are expected to remain unchanged.