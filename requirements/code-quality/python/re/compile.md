## Frequently used regular expressions must be compiled

### Scope

Python code using regular expressions.

### Requirement

Regular expressions used more than once **MUST** be compiled using `re.compile()`.

Compiled regular expression objects **MUST** be used for all subsequent matching operations.

The functions `re.match()`, `re.search()`, `re.fullmatch()`, `re.findall()`, and `re.finditer()` **MUST NOT** be repeatedly called with the same pattern.

Example:

Valid:

```python
rx_mac = re.compile(r"...")

if rx_mac.match(value):
    ...
```

Invalid:

```python
if re.match(r"...", value):
    ...

if re.match(r"...", another_value):
    ...
```

## Why?

The `re` module maintains an internal cache of compiled regular expressions used by functions such as `re.match()` and `re.search()`.

Repeated use of module-level matching functions relies implicitly on this cache. Once the cache reaches its fixed capacity, older entries are evicted and regular expressions must be compiled again, which may lead to significant performance degradation.

Using explicitly compiled regular expressions avoids unnecessary recompilation, provides predictable performance, and gives frequently used patterns meaningful names.