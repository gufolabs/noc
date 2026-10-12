# Persistent System Identity

## Scope

All NOC installations.

## Requirement

The System Identity **MUST** be persistently stored and recoverable after system restart, upgrade, migration, or restore operation.

## Why

The identity of an installation is part of its long-term operational state.

Loss of System Identity may cause an existing installation to be incorrectly recognized as a new installation.