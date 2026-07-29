# Avoid unnecessary abstractions

## Scope

This requirement applies to all refactoring changes.

## Requirement

New abstractions **MUST** be introduced only when they solve an existing problem or provide a clear improvement.

Refactoring **MUST NOT** introduce additional layers, wrappers, indirections, or design patterns without a justified need.

## Why

Unnecessary abstractions increase code complexity, make the implementation harder to understand, and create additional maintenance burden.