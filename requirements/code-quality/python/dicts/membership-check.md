# Dictionary membership checks must use `in` and `not in`

## Scope

Python code that checks the presence or absence of dictionary keys.

## Requirement

When only the presence or absence of a dictionary key needs to be checked and the value is not required, code **MUST** use the `in` or `not in` operators.

Using `dict.get()` only for checking key existence **MUST NOT** be used.

Examples:

Valid:

```python
if key in data:
    ...
```

Valid:

```python
if key not in data:
    ...
```

Invalid:
```python
if data.get(key) is not None:
    ...
```

Invalid:
```python
if data.get(key):
    ...
```

## Why?

The in and not in operators explicitly express dictionary membership checks.

Using dict.get() for existence checks hides the intent and may introduce incorrect behavior when a key exists but contains a falsy value such as None, 0, or an empty string.