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

## Execution Model

NOC **MUST** support execution using any of the following deployment models:

- bare metal with any supported operating system;
- any supported virtualization platform with any supported guest operating system;
- any supported container platform running on any supported operating system.

For each deployment model, all supported combinations **MUST** be supported.

The deployment models are independent alternatives and **MUST NOT** be interpreted as cumulative requirements.

## Execution Model

NOC **MUST** support execution using any of the following deployment models:

- bare metal with any supported operating system;
- any supported virtualization platform with any supported guest operating system;
- any supported container platform running on any supported operating system.

For each deployment model, all supported combinations **MUST** be supported.

The deployment models are independent alternatives and **MUST NOT** be interpreted as cumulative requirements.

## Why?

Runtime requirements establish a clear contract between the NOC project and its operational environment.

They allow developers to select compatible dependencies and allow operators to prepare environments where NOC can be reliably deployed and executed.

Explicit runtime requirements prevent architectural decisions that cannot be supported in production environments.