# Binary Dependency Requirements

## Scope

All dependencies containing binary components used by the NOC project.

## Requirements

Dependencies containing binary components **MUST** provide official or reproducible binary builds.

Binary dependencies **MUST** support the project's supported runtime environments.

Binary dependencies **MUST** be compatible with:

- Linux operating systems using glibc 2.28 or newer;
- glibc-based environments;
- x86-64 architecture;
- ARM64 architecture.

Binary dependencies **MUST NOT** require a glibc version newer than the supported minimum baseline unless explicitly approved.

Binary builds **SHOULD** be produced against the minimum supported glibc baseline to maximize compatibility with supported Linux distributions.

Language-specific dependency requirements **MAY** define additional binary compatibility requirements.

## Why?

Binary dependencies directly affect deployment compatibility and operational stability.

A defined binary compatibility baseline allows NOC to provide predictable deployment across supported environments.