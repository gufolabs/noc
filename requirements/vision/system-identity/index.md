---
requires:
- globally-unique
- stable
- cluster-identity
- opaque
- persistence
- owenership
---
# System Identity

## Scope

All NOC installations.

## Requirement

All NOC installations **MUST** provide a way to uniquely identify the installation.

## Why

NOC installations are long-lived operational systems that may change their deployment environment, infrastructure, topology, and configuration during their lifecycle.

A stable and unique installation identity is required to distinguish one installation from another and to support reliable lifecycle management, maintenance, diagnostics, support, and future platform services.