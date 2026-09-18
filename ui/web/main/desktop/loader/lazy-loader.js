//---------------------------------------------------------------------
// Lazy bundle loader
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Framework-neutral on-demand loader for heavy bundles that should not be in
// the critical path (Monaco, etc.). Each bundle is fetched as a classic script
// only the first time it is actually needed, and the resulting promise is
// cached so concurrent callers share a single load.
//
// Bundle URLs are resolved from the window.NOC_BUNDLES manifest injected into
// the HTML by the build, which lets production use content-hashed filenames
// while keeping a stable logical name here.
//---------------------------------------------------------------------

// Cached load promises, keyed by URL.
const scriptPromises = new Map();
const stylePromises = new Map();

// Injects a <script> for the given URL once. Repeated calls return the same
// promise, so the script is loaded at most once.
export function loadScriptOnce(url){
  if(scriptPromises.has(url)){
    return scriptPromises.get(url);
  }
  const promise = new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = url;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      // Drop the failed promise so a later attempt can retry.
      scriptPromises.delete(url);
      reject(new Error("Failed to load script: " + url));
    };
    document.head.appendChild(el);
  });
  scriptPromises.set(url, promise);
  return promise;
}

// Injects a <link rel="stylesheet"> for the given URL once. Resolves when the
// stylesheet has loaded so callers can wait for styling before rendering.
export function loadStyleOnce(url){
  if(stylePromises.has(url)){
    return stylePromises.get(url);
  }
  const promise = new Promise((resolve, reject) => {
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.type = "text/css";
    el.href = url;
    el.onload = () => resolve();
    el.onerror = () => {
      stylePromises.delete(url);
      reject(new Error("Failed to load stylesheet: " + url));
    };
    document.head.appendChild(el);
  });
  stylePromises.set(url, promise);
  return promise;
}

// Resolves a logical bundle name to its URL via the build-injected manifest,
// falling back to a stable filename when the manifest is absent.
// Document base captured at module-load time, before the app navigates. The
// Navigation API changes location/document.baseURI as the user moves around, so
// resolving a relative bundle URL lazily (at the moment an editor is opened)
// against the *current* URL would point at the wrong directory. Anchoring to
// the load-time base reproduces how the static <script> tags resolved.
const DOCUMENT_BASE = document.baseURI;

function resolveBundleUrl(name, fallback){
  const bundles = window.NOC_BUNDLES || {};
  const raw = bundles[name] || fallback;
  // Absolute URLs (e.g. the hashed "/ui/monaco-<hash>.js" in production) pass
  // through unchanged; relative ones are anchored to the load-time base.
  return new URL(raw, DOCUMENT_BASE).href;
}

let monacoPromise = null;
const _monacoListeners = new Set();

function _notifyMonaco(active){
  for(const fn of _monacoListeners) fn(active);
}

// Subscribe to Monaco loading state changes. fn(true) when load starts,
// fn(false) when it completes or fails. Returns an unsubscribe function.
export function onMonacoLoading(fn){
  _monacoListeners.add(fn);
  return () => _monacoListeners.delete(fn);
}

// Loads the Monaco editor bundle on demand and resolves with window.monaco.
// The bundle exposes monaco as a global (window.monaco / window.monacoAPI). Its
// stylesheet is loaded in parallel: without it the editor internals (e.g.
// .overflow-guard { overflow: hidden }) collapse and the editor does not fill
// its container.
export function loadMonaco(){
  if(window.monaco){
    return Promise.resolve(window.monaco);
  }
  if(monacoPromise){
    return monacoPromise;
  }
  _notifyMonaco(true);
  monacoPromise = Promise.all([
    loadScriptOnce(resolveBundleUrl("monaco", "monaco.js")),
    loadStyleOnce(resolveBundleUrl("monacoCss", "monaco.css")),
  ])
    .then(() => {
      if(!window.monaco){
        throw new Error("Monaco bundle loaded but window.monaco is undefined");
      }
      _notifyMonaco(false);
      return window.monaco;
    })
    .catch((error) => {
      monacoPromise = null;
      _notifyMonaco(false);
      throw error;
    });
  return monacoPromise;
}
