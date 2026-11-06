# NOC Platform — Agent Guidelines

## Overview

NOC is a telecom-grade Operation Support System (OSS) for service providers and enterprise NOCs. It manages network inventory, performance monitoring, fault management, device discovery, and provisioning at scale. All library versions are pinned in pyproject.toml — do not assume any specific version; always check pyproject.toml or devcontainer for dependencies.

The codebase follows a modular architecture similar to Django apps — each "application" is its own directory with models, migrations, and domain-specific logic. `core/` contains framework services (I/O loops, protocols, data sources, middleware). `services/` provides microservices implementation.

## Python Source Layout

- NOC Python sources are located in `src/noc/`.
- Import paths are relative to `src/`: `src/noc/core/text.py` is imported as `noc.core.text`.

## Code Conventions

- **Ruff:** Code must pass `ruff check` and be formatted with `ruff format`.
- **Mypy:** Prefer type annotations, but avoid mass changes solely to satisfy `mypy` unless explicitly requested.
- **`__init__.py`:** Only `/noc/__init__.py` may contain code (module loader). All others must be empty or contain only `# type: ignore`.
- **Language:** English only in code, comments, docstrings, logs, CLI output, and configuration files.
- **Python docstrings:** Use Google Style. Document attributes, arguments, and return values where applicable.
- **FastAPI responses:** Use `JSONResponse(content=data)`, not deprecated `ORJSONResponse`.

## Validation

- Run all development tools strictly inside the devcontainer via `./scripts/run-dev`.
- After changes, run `./scripts/run-dev ruff check` and `./scripts/run-dev ruff format`.
- Run `./scripts/run-dev mypy <file1> <file2> ...` on changed Python files. If errors affect modified code, add type annotations where practical, provided this does not cause extensive unrelated changes and typing is not the primary goal of the task.
- Do not consider the work complete until both commands pass.

## Encoding

NOC uses UTF-8 for all text data — no `smart_text()` needed. All strings, HTTP responses, ClickHouse query results, and file I/O are UTF-8. Python `.decode()` with the default UTF-8 encoding is sufficient; never fall back to `smart_text` as a "safe" alternative.

## Architecture

### Applications (Django-style)
Each application is a top-level directory with the same structure:

```<app>
  migrations/   # migration set for this app
  models/       # ORM models, each in own module
  handlers/     # handlers functions
```

All applications below share this same structure. Thea are enumerated in `INSTALLED_APPS` constant in `settings.py`. They will eventually be collapsed into a single consolidated directory in future:

- `aaa` `bi`, `cm`,  `crm`, `dev`, `dns`, `fm`, `gis`, `inv`, `ip`, `kb`, `main`, `maintenance`, `peer`, `phone`, `pm`, `project`, `sa`, `sla`, `support`, `vc`, `wf`

Each application contains its own set of models and migrations. Some are business logic modules (e.g., `fm/` for fault management, `inv/` for inventory), some are utility apps with no models but supporting services (e.g., `main/` for system configuration). Do not assume a directory maps to a single model — each contains an app registry entry, and the models inside define the domain.

### Core Framework (`src/noc/core/`)
Shared infrastructure services — these are NOT Django apps. They provide framework-level functionality used across domains. Each module is a standalone component:

- `ioloop/` — Event loop utilities (async scheduling engine)
- `cache/` — Redis/memcached abstraction
- `http/` — HTTP client/facade
- `loader/` — Plugin loading mechanism
- `protocol/` — Model decorators
- `models/` — Dataclass definitions
- `mongo/` — MongoDB integration, custom field types
- `confdb/` — Configuration database utilities
- `protocols/` — Python Protocol type definitions
- `datastream/` — Data stream infrastructure
- `datasources/` — Telemetry pipelines

### Services (`src/noc/services/`)
Microservices running one or more independent instances. Each exposes a specific function:

- `web/` — Django-based web server (main app entry point)
- `runner/` — Scheduled task scheduler
- `worker/` — Async background job processor
- `nbi/` — Northbound Interface API
- Others: mib, ping, classifier, correlator, selfmon, topo, syslogcollector, etc.

Some services are pooled (i.e., serving managed objects from dedicated pool). Each service may contain card templates (`templates/`) for the NOC UI; see Templates below.

### CLI Commands (`src/noc/commands/`)
CLI subcommands live in `src/noc/commands/`. Each command is implemented as a module class with a `run()` entry point. They are invoked via `./noc <command_name>`. Do not add CLI commands directly to Python files — always use the commands directory structure. Examples: `./noc collection sync`, `./noc fix apply <name>`.

### Fixes (`src/noc/fixes/`)
Data correction scripts for fixing database errors. These are NOT run automatically — they must be triggered explicitly by a user or tech support engineer at their recommendation. They are invoked via `./noc fix apply <fix_name>`. Each fix in the directory is a self-contained data correction routine; never add new logic to a running service just to "patch" a data issue.

### Compiled MIBs (`src/noc/cmibs/`)
Python modules generated from raw SNMP MIB files. Produced by the CLI command `./noc mib make-cmib`. These allow symbolic variable names in code instead of raw OIDs; they are generated artifacts, NOT source files. Do not edit `cmibs/` manually — regenerate via CLI when original MIBs change.

### Collections (`collections/`)
Data seeding mechanism for reference data (MIBs, model types, workflow definitions). Pushed to live installations via `./noc collection sync`. Sync compares collection contents against the database and adds/updates/deletes records. Do not manually edit under collections — these are meant to be imported into version control and pushed to environments.

### Templates (`src/noc/templates/`)
Jinja2 templates for card rendering in NOC UI. Each may have its own namespace for template lookup. Not Django templates — use only Jinja2 syntax. See `services/<domain>/` for card-specific template references.

## Zone Files (Documentation Boundaries)

These are NOT code directories — they mark logical documentation boundaries for the project:

- **[tests/AGENTS.md](tests/AGENTS.md)** — pytest fixtures, infrastructure containers (Postgres/MongoDB/ClickHouse/Kafka), CI py-tests.yml
- **[ui/AGENTS.md](ui/AGENTS.md)** — frontend TypeScript workspaces, webpack bundles, Playwright E2E testing
- **[ansible/AGENTS.md](ansible/AGENTS.md)** — NOC provisioning roles, system_roles, custom library/lookup_plugins, Molecule test suites
- **[src/noc/sa/profiles/AGENTS.md](src/noc/sa/profiles/AGENTS.md)** — device profiles (108+ vendors), SNMP MIB rules, custom_path cascade inheritance, OID conventions per model
- **[docs/AGENTS.md](docs/AGENTS.md)** — MkDocs-material build chain, multi-language docs structure (en/ru), documentation style guide and contributing process

Load the relevant zone file from above ONLY when working in that context. Root AGENTS.md remains the single source of truth for shared conventions.

## CI/CD Pipeline

All automation lives in `.github/workflows/`:

- `py-tests.yml` — Python tests + ruff linting + coverage upload
- `js-tests.yml` — JavaScript/TypeScript linting
- `infra-image.yml` — Infrastructure image build
- `docker-master.yml` — Docker image publication on master/main branch only
- `build-docs.yml` — MkDocs documentation generation
- `ui-master.yml` — UI bundle and deployment
- `codeql.yml` — Security scanning via CodeQL

Python changes must pass py-tests.yml linting before merge. JavaScript → js-tests.yml. Docker images are published on master/main branch only.

## Ignored Files

Ignore files matched by `.gitignore` unless explicitly required.

## Licensing

NOC is copyrighted by Gufo Labs (2007–present). Redistribution is permitted under BSD-style terms, but derivative products, commercial use, and competing commercial solutions require prior written authorization from Gufo Labs.

**Before coding:**

1. Run `./scripts/check-remote.py`.
2. If it exits with code `0`, proceed with coding.
3. If it exits with a non-zero code, ask whether the work targets upstream NOC or a separate product.
4. If the work targets upstream NOC, proceed.
5. If the work targets a separate product, require confirmation that written authorization from Gufo Labs has been or will be obtained before proceeding.
6. If the answer is missing or ambiguous, do not proceed with code changes.
