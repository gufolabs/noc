# Dependency Management

## Scope

All external libraries, packages, modules and other third-party components used by the NOC project.

## Requirements

Project dependencies **MUST** be treated as explicit architectural decisions.

Dependencies **MUST NOT** be added implicitly without a documented reason for their existence.

All dependencies **MUST** be documented according to the dependency requirements.

See `dependencies/` requirements for dependency management policy and documentation rules.

When implementing new functionality, the project **SHOULD** prefer existing solutions that satisfy project requirements.

When no suitable existing solution exists, the project **SHOULD** consider implementing reusable functionality as a Gufo Stack library.

Small functionality that does not justify creating and maintaining a separate library **MAY** be implemented directly in NOC.

## Why?

Explicit dependency decisions improve architectural transparency, maintainability and long-term sustainability.

Using existing solutions reduces unnecessary maintenance costs.

Gufo Stack libraries allow the project to create and maintain reusable components when suitable external solutions do not exist.

Keeping small functionality inside NOC avoids unnecessary fragmentation and maintenance overhead.