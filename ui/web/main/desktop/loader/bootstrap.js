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

import {api} from "./api.js";
import {auth} from "./auth.js";
import {config} from "./config.js";
import {events} from "./events.js";
import {navigation} from "./navigation.js";
import {loadMonaco, onMonacoLoading} from "./lazy-loader.js";
import {loadUI} from "./ui-loader.js";

// Thin top bar that appears while any NOC.api request is in flight.
// Uses a sliding gradient animation so no progress value is needed.
function createLoadingBar(){
  const style = document.createElement("style");
  style.textContent = `
    #noc-api-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--noc-api-bar-color, #4a90d9) 50%,
        transparent 100%
      );
      background-size: 60% 100%;
      background-repeat: no-repeat;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
    }
    #noc-api-bar.active {
      opacity: 1;
      animation: noc-api-bar-slide 1.2s ease-in-out infinite;
    }
    @keyframes noc-api-bar-slide {
      0%   { background-position: -60% 0; }
      100% { background-position: 160% 0; }
    }
  `;
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.id = "noc-api-bar";
  const append = () => document.body.appendChild(bar);
  if(document.body){
    append();
  } else{
    document.addEventListener("DOMContentLoaded", append);
  }

  let _showTimer = null;
  let _monacoActive = false;
  let _apiActive = false;

  function _sync(active){
    if(active){
      _showTimer = _showTimer || setTimeout(() => bar.classList.add("active"), 300);
    } else if(!_monacoActive && !_apiActive){
      clearTimeout(_showTimer);
      _showTimer = null;
      bar.classList.remove("active");
    }
  }

  api.onLoading((active) => {
    _apiActive = active;
    _sync(active);
  });

  onMonacoLoading((active) => {
    _monacoActive = active;
    _sync(active);
  });
}

// Initializes framework-neutral infrastructure, then loads the UI. Each future
// extraction adds an awaited step before loadUI().
export async function bootstrap(){
  // 1. API layer — fetch wrapper that replaces Ext.Ajax.
  window.NOC = window.NOC || {};
  window.NOC.api = api;
  // 2. Auth / session — reactive session state.
  window.NOC.auth = auth;
  // 3. Config — application settings loaded after auth.
  window.NOC.config = config;
  // 4. Router — Navigation API singleton, framework-neutral.
  window.NOC.navigation = navigation;
  // 5. Event bus — cross-component events, replaces Ext.GlobalEvents.
  window.NOC.events = events;
  createLoadingBar();
  // Expose on-demand bundle loaders as globals so the legacy ExtJS components
  // can lazily pull heavy bundles (Monaco) instead of loading them eagerly.
  window.loadMonaco = loadMonaco;
  await loadUI();
}
