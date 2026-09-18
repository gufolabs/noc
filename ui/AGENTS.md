# NOC UI — Agent Guidelines

## Project Overview

NOC frontend is an ExtJS 4 (Sencha) web interface wrapped in a TypeScript build pipeline. The UI uses classic MVC pattern: `web/<app>/` directories contain ExtJS components, models, and views as unminified JavaScript files compiled by a custom esbuild-based bundler into webpack bundles.

- **Package Manager:** `pnpm@10.33.0` with Node 24
- **TypeScript:** Strict (`tsconfig.json`) — applies to TS scripts only; ExtJS JS code is not typed
- **Linting:** Flat ESLint config (`eslint.config.mjs`) + typescript-eslint for build scripts
- **Unit Tests:** Vitest (for TypeScript helper functions)
- **E2E Tests:** Playwright (Chromium only, browser automation over deployed NOC instance)

## Architecture

### Directory Structure

```
ui/
├── web/                          # ExtJS application source — the main UI codebase
│   ├── <app>/                   # per-application sub-apps: aaa, bi, cm, crm… (mirrors root app structure)
│   │   ├── Application.js        # Ext.application bootstrap for this sub-app
│   │   ├── Model.js              # extjs model definitions
│   │   ├── *.js                  # views, controllers, panels, forms
│   │   └── *.css                 # component-specific styles
│   ├── css/                      # shared UI stylesheets (ExtJS overrides, card layouts)
│   ├── js/                       # shared JS utilities and patches for ExtJS core
│   ├── core/                     # base components extending ExtJS framework base
│   ├── locale/                   # localized strings (gettext .po/.mo files processed by gettext.js)
│   ├── translations/             # translation bundles (EN/RU)
│   ├── ux/                       # ExtJS custom extensions (plugins, widgets)
│   └── img/                      # static images/icons for the UI
├── card/                         # ExtJS card templates — reusable component layouts
│   ├── css/                      # alarmheat.css, outage.css, path.css, monmap.css…
│   └── ...                       # individual card definition files per domain
├── common/                       # shared utility JS (gettext, diff_match_patch, map_layer_creator)
├── pkg/                          # CDN-vendored packages: backbone.min.js, bootstrap, others
├── packages/                     # pnpm workspace packages (e.g., topo-map visualizer)
│   └── topo-map/                 # topology map library — only built dependency per workspace
├── scripts/                      # build tooling and helpers
│   ├── DependencyGraph.ts        # analyze ExtJS dependencies between modules
│   ├── ExtJsParser.ts            # parse ExtJS Application/define syntax
│   └── __test__/                 # unit tests for build tools
├── types/                        # custom TypeScript declarations (e.g., espree.d.ts)
├── dist/                         # compiled webpack bundles — auto-generated, never edit manually
├── tests-playwright/             # E2E test suite — covers real browser interactions
├── eslint.config.mjs             # flat ESLint config for build scripts only
├── vitest.config.js              # Vitest unit test configuration
├── playwright.config.ts          # Playwright E2E test configuration (Chromium, fullyParallel)
├── tsconfig.json                 # TypeScript compiler settings (strict mode)
└── package.json                  # build scripts, dev dependencies, workspace config
```

### Build System

The build pipeline is defined in `package.json` scripts. It uses a custom esbuild + webpack chain — **not** standard pnpm/Webpack defaults:

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Full dev cycle: vendor packages → vendor-dev bundles → build:bundles-dev → watch mode |
| `pnpm run watch` | Incremental rebuild of ExtJS + CSS into `dist/` (fastest iter path) |
| `pnpm run sync` | Browser-sync proxy for hot-reload against a running NOC backend (`localhost:8080`) |
| `pnpm run build` | Full production build: vendor → prod bundles → watch-bundles-prod |
| `./scripts/build/build-ui` | Production CI script — calls the full production chain |

Production builds include minification, dead code elimination, and bundle splitting. Output goes to `ui/dist/`. **Never run `pnpm run build` during iteration** — use `watch` or `dev`.

### App-to-App Mapping

Each sub-application under `web/<app>/` mirrors a backend application from root:

| `web/<app>/` | ↔ Backend app | Purpose |
|-------------|--------------|---------|
| `web/aaa` | `aaa/` | Auth/access UI forms |
| `web/bi` | `bi/` | BI dashboard reports |
| `web/cm` | `cm/` | Config management cards |
| `web/fm` | `fm/` | Alarm console, active alarms, action panels |
| `web/gis` | `gis/` | Map overlays, geographic objects |
| `web/inv` | `inv/` | Network inventory object browsers |
| `web/ip` | `ip/` | IP space management UI |
| `web/main` | `main/` | System settings, API tokens, audit trail |
| `web/sa` | `sa/` | Device profile editing interface |
| ... (all root apps have a `web/<app>/` counterpart) | | |

When you need to modify the UI for a specific domain, look at both:
1. **`web/<app>/`** — ExtJS frontend components for that app
2. **`<app>/AGENTS.md`** (or root AGENTS if no zone file exists) — backend models and API endpoints

### Card System

Cards are the primary UI widget type in NOC. They appear on dashboard panels, device detail pages, and alarm grids. Each card is a self-contained ExtJS component with its own CSS rules:

```
card/
├── css/alarmheat.css          # Alarm heat map visualization
├── css/card.css               # Base card layout (shared across all cards)
├── css/monmap.css             # Monitor map node representation
├── css/outage.css             # Outage timeline card
└── css/path.css               # Path traversal diagram card
```

**Card conventions:**
- CSS files under `card/css/*.css` are bundled into the corresponding domain's page bundle, not globally loaded
- Cards reference data via ExtJS stores connected to REST endpoints (defined in backend)
- Never mix inline `<style>` tags — all styles go in `.css` files under the appropriate domain or `web/<app>/css/`

## Code Conventions

### TypeScript Scope

TypeScript **only** applies to:
- Build scripts (`scripts/`, `*.ts` in root UI)
- Workspace packages (`packages/topo-map/`)
- Type declaration files (`types/`)

**ExtJS JavaScript code is NOT typed.** The `.js` files under `web/<app>/` follow Sencha ExtJS 4 conventions:
- Classes defined via `Ext.define({...})` — not ES6 classes
- Views use `xtype` strings (not JSX/Vue templating)
- Models extend `Ext.data.Model` with field definitions in JS object syntax

### ExtJS Component Structure

Each `web/<app>/` directory contains:
- `.js` files using ExtJS class hierarchy — `Application.js` bootstraps the app, `Model.js` defines data models, plus view/controller/panel/etc. files
- `.css` files for component-specific styling (ExtJS CSS overrides)
- Models use `Ext.data.Model` with fields matching backend MongoDB document schemas (not relational DB columns)
- Views bind to backend REST API endpoints via `Ext.data.proxy.Rest`

### Styling

- ExtJS uses SASS compilation during build — source files are in `.scss` under `web/<app>/css/` or `card/css/`
- Card CSS rules must use domain-specific scopes (e.g., `.alarmheat-card .x-grid-cell`) to avoid global leakage
- NOC theme variables (colors, spacing) come from card's base themes — don't override with hardcoded hex values

### Language & Localization

- UI strings go in `web/locale/` as gettext `.po` files for EN/RU translation
- Runtime localization uses `web/common/gettext.js` — use `ngettext()` or `_()` helper functions in ExtJS code
- Never hardcode user-visible text directly in `.js` or `.css`

### Dependency Management

- All vendored external packages (backbone, bootstrap, etc.) live in `pkg/` as CDN copies — do NOT remove these during updates
- Workspace dependencies (`packages/topo-map`) are the only ones installed via pnpm
- **Never add new external npm packages without confirming with the maintainer.** The project is large and every dependency increases bundle size significantly. Prefer vendored code in `pkg/` or custom extensions in `common/` over new imports.

## Testing

### Unit Tests (Vitest)

Location: `*.test.ts` alongside source files, or in `scripts/__test__/` for build scripts.

Run locally from `ui/`:
```bash
vitest        # all tests
vitest <pattern>  # filter by pattern
```

Unit tests cover TypeScript helpers and utilities only (ExtJS JS code is tested via E2E only). Tests run instantly during development.

### E2E Tests (Playwright)

Configuration: `playwright.config.ts`
- **Browser:** Chromium only
- **Test dir:** `tests-playwright/`
- **Parallelism:** `fullyParallel` by default; CI uses 1 worker with 2 retries per test
- **Reporter:** HTML output

```bash
pnpm run test:e2e        # all E2E tests (headed mode)
pnpm run test:e2e --project=chromium  # explicit browser targeting
```

**When writing E2E tests:**
- Tests must connect to a deployed NOC instance first — no mock backend
- Each test targets one functional domain (login, alarm navigation, inventory search, etc.)
- Use `page.locator()` for CSS selectors or `page.getByRole()` for accessibility-based selectors (preferred)
- Never use XPath unless truly necessary

## When to Load This Zone File

Use this zone file when:
- Modifying NOC web UI components (`web/`)
- Writing new ExtJS cards (`card/`)
- Adding build scripts or bundling changes (`*.ts` in root UI)
- Running tests that involve the browser layer (Playwright, Vitest)
- Updating translation files (`locale/`, `translations/`)

**Do NOT use this zone file when:**
- Modifying backend models/APIs in root applications — see [root AGENTS.md](AGENTS.md) and the relevant app's AGENTS.md
- Writing Ansible provisioning for the NOC server — see [ansible/AGENTS.md]
- Working with device profiles (SNMP MIB rules) — see [sa/profiles/AGENTS.md]
