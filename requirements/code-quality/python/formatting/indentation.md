## Python code must use four-space indentation

## Scope

Python source code.

## Requirement

Python code **MUST** use four spaces for each indentation level.

Tab characters **MUST NOT** be used for indentation.

Examples:

Preferred:

```python
if ready:
    process()
```

Invalid:

```python
if ready:
	process()
```

## Why?

Python uses indentation to define block structure.

Using a consistent four-space indentation style improves readability and follows the Python language style convention defined by PEP 8.

Prohibiting tab characters prevents inconsistent rendering across editors and avoids indentation-related errors.