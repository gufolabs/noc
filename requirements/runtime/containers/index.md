# Supported Container Platforms

## Scope

Container environments where NOC can be deployed and operated.

## Requirements

NOC **MUST** support container platforms explicitly defined in this requirement subtree.

Each supported container platform **MUST** have a dedicated requirement document describing:

- container platform name;
- supported versions;
- required runtime configuration;
- compatibility constraints.

Container images and containerized deployments **MUST** run on all supported container platforms.

Container-specific requirements **MUST NOT** change the functional behavior of NOC compared with non-containerized deployments.

## Why?

Containers are widely used for deployment automation, scalability and reproducibility.

Explicit container requirements define supported deployment models and prevent hidden assumptions about container environments.