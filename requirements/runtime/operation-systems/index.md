# Supported Operating Systems

## Scope

Operating systems where NOC can be installed, deployed and operated.

## Requirements

NOC **MUST** support operating systems explicitly defined in this requirement subtree.

Each supported operating system **MUST** have a dedicated requirement document describing:

- operating system name and version;
- supported architectures;
- required system components;
- compatibility constraints.

NOC **MUST** operate correctly on any supported operating system without requiring undocumented modifications.

The list of supported operating systems **MUST** be maintained and updated as part of the project lifecycle.

## Why?

Explicit operating system requirements define the supported deployment boundary and prevent accidental dependency on unsupported platforms.

A documented operating system matrix allows developers, operators and automated tools to verify compatibility.