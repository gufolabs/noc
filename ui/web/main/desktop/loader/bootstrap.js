//---------------------------------------------------------------------
// Application bootstrap
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Framework-neutral bootstrap. This layer is intentionally free of any
// dependency on ExtJS (or any future UI framework). It is the place where the
// neutral infrastructure that should outlive ExtJS is initialized, in order of
// importance (see ui/docs/extjs-migration-summary.md):
//
//   1. API layer    - fetch wrapper with interceptors (replaces Ext.Ajax)
//   2. Auth/session - reactive session state module
//   3. Config       - loadConfig() via fetch or embedded JSON
//   4. Router       - already on the Navigation API
//   5. Event bus    - neutral EventEmitter (replaces Ext.GlobalEvents)
//   6. Logging / error tracking / i18n
//
// None of these are implemented yet; this step only introduces the loader
// chain. New neutral modules are wired in here as they are extracted, before
// the UI is loaded.
//---------------------------------------------------------------------

import {loadMonaco} from "./lazy-loader.js";
import {loadUI} from "./ui-loader.js";

// Initializes framework-neutral infrastructure, then loads the UI. Each future
// extraction adds an awaited step before loadUI().
export async function bootstrap(){
  // Neutral infrastructure init goes here as modules are extracted from ExtJS.
  // Expose on-demand bundle loaders as globals so the legacy ExtJS components
  // can lazily pull heavy bundles (Monaco) instead of loading them eagerly.
  window.loadMonaco = loadMonaco;
  await loadUI();
}
