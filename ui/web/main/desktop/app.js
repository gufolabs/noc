//---------------------------------------------------------------------
// Application UI (build entry point)
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// This file is the esbuild entry point. NocLoaderPlugin prepends an import for
// every Ext.define class (topologically sorted) ahead of this code, so all NOC
// classes are defined before the loader runs. The application itself is started
// by the framework-neutral loader chain (index -> bootstrap -> ui-loader ->
// ext-application); ExtJS is no longer the root. See loader/index.js and
// ui/docs/extjs-migration-summary.md.
//---------------------------------------------------------------------
import "./loader/index.js";

console.debug("Defining NOC application");
