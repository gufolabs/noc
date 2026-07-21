---
requires:
- operating-systems/
- virtualization/
- containers/
- architectures/
- languages/
- services/
---

# Runtime Requirements

## Scope

Operational environment required to deploy, run and maintain the NOC system.

Runtime requirements define conditions that **MUST** be provided by the operational environment for supported NOC installations.

## Requirements

NOC **MUST** define supported runtime environments.

Each runtime requirement **MUST** describe an operational condition required for NOC deployment or execution.

Runtime requirements **MUST** define:

- supported platforms;
- supported operating systems;
- required language runtimes;
- required external services;
- compatibility constraints.

Runtime requirements **MUST** be treated as constraints for architecture and dependency decisions.

Dependencies **MUST** be compatible with the supported runtime requirements.

The project **MUST NOT** introduce dependencies that cannot be supported within the defined runtime environment.

## Why?

Runtime requirements establish a clear contract between the NOC project and its operational environment.

They allow developers to select compatible dependencies and allow operators to prepare environments where NOC can be reliably deployed and executed.

Explicit runtime requirements prevent architectural decisions that cannot be supported in production environments.