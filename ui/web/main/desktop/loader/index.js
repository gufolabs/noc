//---------------------------------------------------------------------
// Application loader entry
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Top of the framework-neutral loader chain:
//
//   index -> bootstrap -> ui-loader -> ext-application
//
// This module is the application root. ExtJS is started further down the
// chain as one of the loaded modules, instead of being the foundation that
// owns the start (Ext.application). This is the first step of the ExtJS
// migration described in ui/docs/extjs-migration-summary.md.
//---------------------------------------------------------------------

import {bootstrap} from "./bootstrap.js";

bootstrap().catch((error) => {
  console.error("[loader] Bootstrap failed:", error);
});
