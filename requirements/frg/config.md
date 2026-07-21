---
namespace: frg
checks:
- id: requirements-is-requirements
  description: Requirements directory is `requirements/`
- id: canonical-is-en
  description: Canonical language is `en`
- id: entrypoint-is-noc
  description: Entrypoint is a single requirement named `noc`
---

# FRG Configuration Requirements

## Scope

FRG configuration file `.frg.yml`.

## Requirements

The FRG configuration file **MUST** satisfy the following requirements:

- Requirements directory **MUST** be `requirements/`.
- Canonical language **MUST** be `en`.
- The entrypoint **MUST** be a single requirement named `noc`.

## Why?

A predictable FRG configuration allows tools, contributors and automated agents to discover and process project requirements consistently.