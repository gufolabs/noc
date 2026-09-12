# Python Runtime Requirements

## Scope

Python runtime environments required for development, deployment and operation of the NOC system.

## Requirements

NOC **MUST** support execution on the following Python versions:

- Python 3.12;
- Python 3.13;
- Python 3.14.

Python runtime compatibility **MUST** be maintained for all supported Python versions.

Python-specific dependencies **MUST** satisfy the requirements of the supported Python runtime versions.

## Why?

Python is a core runtime environment of the NOC system.

Supporting multiple actively maintained Python versions allows the project to follow the Python ecosystem evolution while providing stable operation for users and deployment environments.

Explicitly defining supported Python versions makes dependency selection, testing and release validation predictable.