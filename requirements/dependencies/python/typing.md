## Python dependencies should provide type information

## Scope

Third-party Python packages used by the NOC project.

### Requirement

Python dependencies **SHOULD** provide type information compatible with Python type checking tools.

Dependencies with built-in type annotations **SHOULD** be preferred over equivalent dependencies without type information.

## Why?

Type information improves static analysis, code completion, and source code maintainability.

Using typed dependencies allows developers and automated tools to detect errors earlier and provides better understanding of external APIs.