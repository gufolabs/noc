# Python Dependency Requirements

## Scope

Third-party Python packages used by the NOC project.

## Requirements

Each Python dependency **MUST** have a dedicated requirement document.

A dependency requirement document **MUST** define:

- the package name;
- the required version;
- the purpose of the dependency;
- the rationale for adopting the dependency.

Each Python dependency **MUST** use an explicitly pinned version.

Python dependencies **MUST** be compatible with the supported Python runtime versions.

If a Python dependency contains binary components, binary distributions **MUST** be available for every supported combination of:

- Python version;
- operating system;
- CPU architecture.

The absence of a binary distribution for any supported runtime platform **MUST** be considered a compatibility failure.

Python dependencies requiring compilation during installation on supported runtime platforms **MUST NOT** be used.

Python dependencies **MUST** satisfy all common dependency requirements.

Python-specific requirements **MAY** define additional dependency requirements.

Each dependency requirement document **MUST** identify the project scope affected by the dependency.

The scope **SHOULD** include:

- source code components;
- packaging and build configuration;
- runtime usage;
- operational integration points.

## Why?

Python is the primary implementation language of the NOC project.

Documenting every Python dependency makes architectural decisions explicit, explains why each package exists, and simplifies future maintenance.

Pinned versions guarantee reproducible builds.

Requiring binary distributions for every supported runtime platform ensures predictable installation, eliminates the need for build toolchains in production environments, and keeps deployment fast and reliable.