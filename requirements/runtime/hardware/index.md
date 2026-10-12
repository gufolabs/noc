---
requires:
- x86-64
- arm64
---
# Supported Hardware Platforms

## Scope

Hardware architectures and platforms where NOC can be installed and operated.

## Requirements

NOC **MUST** support hardware architectures explicitly defined in this requirement subtree.

Each supported hardware platform **MUST** have a dedicated requirement document describing:

- architecture;
- compatibility constraints;
- supported execution environments.

NOC **MUST** operate correctly on all supported hardware architectures.

Hardware-specific requirements **MUST NOT** introduce unnecessary restrictions on supported deployment models.

## Why?

Explicit hardware requirements define the supported execution boundary of the system.

A documented hardware support matrix allows predictable deployment, dependency selection and compatibility validation.