# Installation Ownership

## Scope

All NOC installations.

## Requirement

The System Identity **MUST** belong to the logical NOC installation and **MUST NOT** belong to individual system components, nodes, or deployment resources.

The System Identity **MUST** represent the installation as a whole.

## Why

A NOC installation is a logical operational entity composed of multiple components that may change during its lifecycle.

Nodes, services, containers, virtual machines, and other deployment resources may be replaced, recreated, or reconfigured without creating a new installation.

The identity of the installation must remain independent from its internal implementation and deployment structure.