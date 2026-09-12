# Stable System Identity

## Scope

All NOC installations.

## Requirement

The System Identity **MUST remain stable during the entire lifecycle of the installation**.

The System Identity **MUST survive**:

- software updates
- configuration changes
- infrastructure changes
- migration between environments.

## Why

A NOC installation is a long-lived operational system.

Changes in software version, infrastructure, or deployment process must not create a new logical identity for an existing installation.

Stable identity is required for reliable lifecycle management, registration, support, diagnostics, and operational history.