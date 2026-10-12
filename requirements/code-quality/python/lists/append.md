## Python lists must use appropriate append operations

### Scope

Python code that appends elements to lists.

### Requirement

Adding a single element to a list **MUST** use `list.append()`.

Adding multiple elements from an iterable **MUST** use `list.extend()`.

Complex list construction **MAY** use iterable unpacking.

Creating temporary lists solely to append their contents to another list **MUST NOT** be used.

Examples:

Valid:

```python
items.append(item)
```

Valid:

```python
items.extend(other_items)
```

Valid:
```python
items = [first, *items, last]
```

Invalid:
```python
items += [item]
```

Invalid:
```python
items += [x for x in other_items]
```

## Why?

Using the appropriate list operation makes the intent explicit and avoids unnecessary temporary list creation.

The distinction between `append()`, `extend()`, and iterable unpacking improves readability while preserving efficient list operations.