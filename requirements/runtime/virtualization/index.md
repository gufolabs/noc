# Supported Virtualization Platforms

## Scope

Virtualization environments where NOC can be deployed and operated.

## Requirements

NOC **MUST** support virtualization platforms explicitly defined in this requirement subtree.

Each supported virtualization platform **MUST** have a dedicated requirement document describing:

- virtualization platform name;
- supported versions;
- required configuration;
- compatibility constraints.

NOC **MUST** operate correctly when deployed inside any supported virtualization environment.

Virtualization-specific requirements **MUST NOT** introduce dependencies on unsupported infrastructure features.

## Why?

Virtualization is a common deployment model for production systems.

Explicit virtualization requirements define supported operational environments and simplify deployment planning.