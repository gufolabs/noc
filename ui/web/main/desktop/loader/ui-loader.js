//---------------------------------------------------------------------
// UI loader
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Owns the lifecycle of the legacy ExtJS UI. The loader waits until the
// global Ext runtime is available, then starts the ExtJS application. As the
// migration progresses, this is the single place that decides which UI stack
// to boot, so ExtJS can later be replaced (or loaded via dynamic import())
// without touching the framework-neutral bootstrap above it.
//---------------------------------------------------------------------

import {startExtApplication} from "./ext-application.js";

// How long to wait for the global Ext runtime before giving up.
const EXT_READY_TIMEOUT_MS = 15000;
const EXT_POLL_INTERVAL_MS = 25;

// Resolves once window.Ext is available. Today ExtJS is delivered as a global
// via external.js (a synchronous <script> evaluated before the app bundle), so
// this normally resolves on the first check. The poll keeps the loader robust
// if Ext is ever moved behind an async import().
function waitForExt(){
  return new Promise((resolve, reject) => {
    if(typeof window.Ext !== "undefined"){
      resolve();
      return;
    }
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if(typeof window.Ext !== "undefined"){
        clearInterval(timer);
        resolve();
      } else if(Date.now() - startedAt > EXT_READY_TIMEOUT_MS){
        clearInterval(timer);
        reject(new Error("Ext runtime is not available"));
      }
    }, EXT_POLL_INTERVAL_MS);
  });
}

// Boots the application UI. Returns a promise that resolves once the UI stack
// has been handed control.
export async function loadUI(){
  await waitForExt();
  startExtApplication();
}
