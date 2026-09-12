## Python modules must have limited size

### Scope

Python source files.

### Requirement

Python modules **MUST NOT** exceed 1000 lines.

## Exceptions

Generated files and files containing declarative data **MAY** exceed the limit when splitting them would reduce readability or maintainability.

## Why?

Keeping modules within a reasonable size improves readability, navigation, and maintainability.

A defined size limit prevents excessive growth of modules and encourages separation of responsibilities.