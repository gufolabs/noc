---
requires:
- ../dependencies/binary-distribution
---
# No Native Toolchain Requirement

## Scope

Runtime environment used to install and operate NOC.

## Requirements

The runtime environment **MUST NOT** require native compilation of dependencies.

Installing NOC **MUST NOT** require:

- C compilers;
- C++ compilers;
- Rust toolchains;
- Go toolchains;
- build systems;
- header packages;
- development libraries;
- any other native build tools.

All dependency artifacts required for supported runtime environments **MUST** be available as prebuilt binary packages.

If a required dependency does not provide suitable binary artifacts, the project **MUST** ensure their availability before adopting the dependency.

This requirement applies regardless of the programming language used by the dependency.

## Why?

Production systems should not require development toolchains merely to install or upgrade software.

Prebuilt artifacts improve installation reliability, reduce deployment complexity and provide deterministic installations.

When an upstream project does not provide suitable binary artifacts, the responsibility shifts to the NOC project to supply them or maintain a compatible fork.