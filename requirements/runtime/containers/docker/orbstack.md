# OrbStack Runtime Requirements

## Scope

OrbStack-based container runtime environment used for development, demonstration and operation of the NOC system.

## Requirements

The NOC system **MUST** support execution in an OrbStack container runtime environment.

The supported OrbStack version **MUST** be explicitly specified.

The NOC system **MUST** support the minimum supported OrbStack version:

- OrbStack >= 2.2.1

The project **MUST** verify compatibility with the specified OrbStack version before declaring support for it.

Unsupported or incompatible OrbStack versions **MUST** be documented when known.

## Why?

OrbStack provides a lightweight container runtime environment, especially effective on macOS development platforms.

Supporting OrbStack improves developer experience by allowing NOC development, testing and demonstrations without requiring dedicated external servers.

OrbStack is considered an additional supported container runtime environment alongside standard Docker installations.