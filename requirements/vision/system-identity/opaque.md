# Opaque System Identity

## Scope

All NOC installations.

## Requirement

The System Identity **MUST NOT** contain any encoded information about the installation, deployment environment, or organization.

## Why

The purpose of the System Identity is to uniquely identify an installation, not to describe it.

Embedding installation details into the identity creates unnecessary coupling between the identifier and the current environment, prevents seamless migration, and may expose information that should remain separate from the identity itself.