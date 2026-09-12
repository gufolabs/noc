---
name: Preserve behavior
---

# Preserve behavior

## Scope

This requirement applies to all refactoring changes.

## Requirement

Existing behavior **MUST** be preserved unless changing the behavior is an explicit goal of the change.

Refactoring changes **MUST NOT** introduce unintended changes to functionality, interfaces, or externally observable behavior.

## Why

Refactoring improves code structure without changing what the system does.

Preserving behavior reduces regression risk and allows improvements to be introduced safely.