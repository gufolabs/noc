# Dependency Version Pinning Requirements

## Scope

All external dependencies used by the NOC project.

## Requirements

All direct dependencies **MUST** use explicitly pinned versions.

Dependency versions **MUST** specify an exact version.

Version ranges, floating versions and non-deterministic version specifications **MUST NOT** be used for direct dependencies.

Examples of prohibited version specifications:

- `>=1.0`
- `^1.0`
- `~1.0`
- `latest`
- unpinned branch references;
- unpinned tag references.

The exact dependency versions **MUST** be reproducible for each supported NOC release.

## Why?

Explicit version pinning improves reproducibility, prevents unexpected dependency changes and reduces software supply chain risks.