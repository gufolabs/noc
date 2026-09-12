---
requires:
- licensing
- approved-licenses
- prohibited-licenses
- restricted-licenses
- version-pinning
- binary-distribution
- health
- python/
- github/
- services/
---

# Dependency Management Requirements

## Scope

All external components required for development, building, distribution, deployment and operation of the NOC project.

The scope includes:

- external libraries, packages and modules;
- runtime components;
- databases and data storage systems;
- message brokers and communication systems;
- external services required for NOC operation;
- compilers and build toolchains;
- development and testing tools;
- infrastructure components and supporting software;
- other third-party components integrated into the project.

Any external component required to build, deliver, maintain or operate NOC **MUST** be considered a dependency and is subject to these requirements.

## Requirements

Dependencies **MUST** be considered architectural decisions.

Each dependency **MUST** have a dedicated requirement document describing:

- dependency name;
- purpose and usage scope;
- reason for adoption;
- supported versions and compatibility requirements.

Dependency requirements **MUST** be stored under the `requirements/dependencies/` directory.

Each dependency **MUST** be traceable to the requirements that justify its adoption.

The project **MUST** be able to identify all dependencies and their exact versions used in every supported NOC release.

Dependencies **MUST** satisfy common dependency requirements and applicable ecosystem-specific requirements.

## Language-Specific and Ecosystem Requirements

Programming language ecosystems and dependency categories **MAY** define additional dependency requirements.

Language-specific and ecosystem-specific requirements **MUST NOT** weaken common dependency requirements.

## Why?

Dependencies are part of the project's architecture and directly affect security, reliability and maintainability.

Explicit dependency documentation makes architectural decisions transparent and allows developers, contributors and automated tools to understand why each component exists.

A well-defined dependency policy reduces operational risks and improves the long-term sustainability of the project.