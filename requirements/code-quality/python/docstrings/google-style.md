## Python docstrings must use Google style

### Scope

Python docstrings.

### Requirement

Python docstrings **MUST** follow the Google Python Style Guide format.

Docstrings **SHOULD** use standard Google Style sections when applicable:

- `Args` for function and method arguments.
- `Returns` for returned values.
- `Raises` for exceptions raised by the code.

Example:

```python
def get_user(user_id: int) -> User:
    """Get user by identifier.

    Args:
        user_id: User identifier.

    Returns:
        User object.

    Raises:
        UserNotFoundError: If user does not exist.
    """
```

## Why?

Using a common docstring format makes source code documentation predictable and easier to read.

Google Style provides a simple and widely adopted structure for documenting interfaces, arguments, return values, and exceptions.