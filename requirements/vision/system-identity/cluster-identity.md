# Cluster System Identity

## Scope

All clustered NOC installations.

## Requirement

All nodes belonging to the same NOC cluster **MUST** use the same System Identity.

The System Identity **MUST** represent the logical installation and MUST NOT represent an individual cluster node.

## Why?

A clustered NOC deployment consists of multiple technical components forming one operational system.

External services and users need to identify the installation as a whole, regardless of the number of nodes, node replacement, or cluster topology changes.