---
requires:
- kind: github
  project: gufolabs/frg
  requirement: frg
  tag: master
- common
- structure
- clarity
- config
---

# Federated Requirements Graph (FRG) Requirements

## Scope

FRG-related configuration, declarations and practices used by the NOC project.

This includes:

- `requirements/` directory containing project requirements;
- `.frg.yml` configuration file;
- integration with external FRG requirement sources;
- local conventions extending the FRG specification.

## Requirements

NOC **MUST** use FRG as the requirements management framework.

NOC **MUST** conform to the federated FRG specification.

NOC **MUST** define local FRG requirements for project-specific decisions not covered by federated requirements.

Local FRG requirements **MUST NOT** contradict federated FRG requirements.

## Why?

FRG provides a structured and machine-readable way to maintain project requirements.

Federation allows NOC to reuse common standards while maintaining project-specific requirements and conventions.