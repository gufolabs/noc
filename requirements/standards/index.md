---
requires:
- golden-rule
---
# Standards Requirements

## Scope

All project activities, artifacts, processes and interactions that may be influenced by external or internal standards.

## Requirements

NOC **MUST** identify and track standards that are considered applicable to the project.

Applicable standards **MUST** be represented as requirements inside the `requirements/standards/` directory.

Each standard requirement **SHOULD** describe:

- standard name and source;
- purpose and applicability;
- scope of application;
- requirements or practices adopted by the project;
- references to project requirements implementing the standard.

Standards **MAY** include:

- industry standards;
- technical standards;
- interoperability standards;
- security standards;
- development practices;
- community standards;
- organizational guidelines.

Compliance with a standard **MUST** be explicitly declared through references to requirements that implement or satisfy the standard.

Standards that are not applicable to the project **MUST NOT** create unnecessary requirements.

## Why?

Standards provide external sources of knowledge and expectations for project behavior.

Explicitly tracking applicable standards improves transparency, traceability and helps explain why certain project requirements exist.

Separating standards from requirements allows the project to distinguish between what the project must do and why the project chooses to do it.