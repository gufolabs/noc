## List comprehensions must be used for simple list construction

### Scope

Python code that constructs lists from iterables.

### Requirement

List comprehensions **MUST** be used for simple list construction when the operation consists of transforming or filtering elements from an iterable.

Manual element-by-element list construction **MUST NOT** be used when the same logic can be expressed clearly using a list comprehension.

Examples:

Valid:

```python
names = [user.name for user in users]
```

Invalid:
```python
names = []
for user in users:
    names.append(user.name)
```

## Why?

List comprehensions are the standard Python syntax for expressing simple collection transformations.

Using list comprehensions makes the intent clearer, reduces unnecessary boilerplate, and keeps related transformation logic in a single expression.

Manual list construction should be reserved for cases where additional control flow or side effects make a comprehension less readable.