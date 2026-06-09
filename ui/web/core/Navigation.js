//---------------------------------------------------------------------
// NOC.core.Navigation
//---------------------------------------------------------------------
// Framework-agnostic navigation layer.
//
// Wraps the browser Navigation API (window.navigation) and replaces the
// ExtJS hash-routing facade (Ext.History / Ext.util.History) with a small,
// stable surface used across the app:
//
//   getToken()                  -> current route (hash without leading "#")
//   navigate(token, options)    -> change route (push by default)
//   subscribe(handler)          -> observe route changes, returns unsubscribe
//   init()                      -> start observing
//
// Mapping from the legacy Ext.History API:
//   getHash() / getToken()  -> getToken()
//   setHash(t)              -> navigate(t)                  (push, like Ext)
//   add(t)                 -> navigate(t)                  (push)
//   add(t, true)           -> navigate(t, {dedup: true})   (skip if unchanged)
//   init()                 -> init()
//
// Note: Ext.History.setHash() pushes a history entry (it sets location.hash),
// so navigate() pushes by default. Pass {replace: true} for replace semantics.
//
// Phase 1 keeps hash-based URLs (e.g. "#fm.alarm/123?status=A"). The
// internal logic depends only on the DOM/Navigation API, not on ExtJS, so
// the surrounding Ext.define singleton is purely a build/loader concern and
// can be dropped during the later vanilla migration.
//
// Browser support: window.navigation exists in Chromium-based browsers. When
// it is missing (Firefox/Safari) the module transparently falls back to the
// "hashchange" event, reproducing the previous Ext.History behaviour without
// a polyfill.
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.core.Navigation");

Ext.define("NOC.core.Navigation", {
  singleton: true,

  // True when the native Navigation API is available.
  supported: typeof window !== "undefined" && "navigation" in window,
  // Registered route-change handlers.
  _subscribers: null,
  // Last token we emitted, used to de-duplicate notifications.
  _current: "",
  // Bound listeners (so we can detach them later).
  _onNavigateBound: null,
  _onHashChangeBound: null,
  _initialized: false,
  // When true, navigate() is a no-op (used while syncing content to the URL).
  _silent: false,
  // When true, navigate() replaces instead of pushing (used during initial
  // launch/restore so reconstructing the URL does not add spurious history
  // entries). Auto-ends when the reconstructed token matches the launch URL.
  _replaceMode: false,
  _replaceTarget: null,
  _replaceTimer: null,
  // Token of the last programmatic navigation, used by the fallback path to
  // distinguish programmatic changes from user back/forward.
  _programmaticToken: null,

  // Start observing route changes. Idempotent. Returns this.
  init: function(){
    if(this._initialized){
      return this;
    }
    this._subscribers = [];
    this._current = this.getToken();
    if(this.supported){
      this._onNavigateBound = this._onNavigate.bind(this);
      window.navigation.addEventListener("navigate", this._onNavigateBound);
    } else{
      this._onHashChangeBound = this._onHashChange.bind(this);
      window.addEventListener("hashchange", this._onHashChangeBound);
    }
    // Convenience alias for call sites: NOC.navigation.*
    NOC.navigation = this;
    this._initialized = true;
    return this;
  },

  // Tear down listeners. Mainly for tests / hot reload.
  destroy: function(){
    if(this._onNavigateBound){
      window.navigation.removeEventListener("navigate", this._onNavigateBound);
      this._onNavigateBound = null;
    }
    if(this._onHashChangeBound){
      window.removeEventListener("hashchange", this._onHashChangeBound);
      this._onHashChangeBound = null;
    }
    this._subscribers = [];
    this._initialized = false;
  },

  // Current route: the hash without the leading "#", URL-decoded.
  // Mirrors Ext.util.History.getToken() / getHash().
  getToken: function(){
    return this._tokenFromUrl(window.location.href);
  },

  // Change the current route.
  //   token   - new route string (hash payload, without "#")
  //   options - { replace: bool, dedup: bool }
  //       replace - replace the current history entry instead of pushing.
  //                 Default false to match Ext.History.setHash() (push).
  //       dedup   - do nothing if token equals the current one
  //                 (emulates Ext.History.add(token, true)).
  // Returns true if a navigation was issued, false otherwise.
  navigate: function(token, options){
    const opts = options || {},
      next = this._normalize(token);
    // While syncing app content to the URL (e.g. handling back/forward) we
    // must not emit our own navigations, otherwise we would pollute history
    // and fight the user's traversal.
    if(this._silent){
      return false;
    }
    if(opts.dedup && next === this.getToken()){
      return false;
    }
    const url = this._buildUrl(next),
      // During initial launch/restore replace instead of push so the URL the
      // browser already loaded is not duplicated into history.
      replace = opts.replace || this._replaceMode;
    // Mark the next observed change as programmatic so the fallback path can
    // tell it apart from a user-initiated back/forward (the Navigation API
    // reports this natively via event.navigationType).
    this._programmaticToken = next;
    if(this.supported){
      window.navigation.navigate(url, {
        history: replace ? "replace" : "push",
      });
    } else{
      if(replace){
        window.location.replace(url);
      } else{
        // Setting location.hash pushes a history entry, like Ext.setHash().
        window.location.hash = next;
      }
    }
    return true;
  },

  // Enter replace mode for the duration of the initial app launch/restore.
  // Captures the current (just-loaded) URL as the target; replace mode ends
  // automatically once the restore reconstructs that URL, or after a safety
  // timeout if it never exactly matches.
  beginReplaceMode: function(){
    this._replaceMode = true;
    this._replaceTarget = this.getToken();
    if(this._replaceTimer){
      clearTimeout(this._replaceTimer);
    }
    this._replaceTimer = setTimeout(() => this.endReplaceMode(), 8000);
  },

  endReplaceMode: function(){
    this._replaceMode = false;
    this._replaceTarget = null;
    if(this._replaceTimer){
      clearTimeout(this._replaceTimer);
      this._replaceTimer = null;
    }
  },

  // Run fn while suppressing any navigate() calls it triggers (directly or via
  // listeners). Used when applying a back/forward target to the app so the URL
  // the browser already set is not overwritten. Reentrant-safe.
  silent: function(fn){
    const prev = this._silent;
    this._silent = true;
    try{
      fn();
    } finally{
      this._silent = prev;
    }
  },

  // Subscribe to route changes. handler receives (token, type) where type is
  // "push" | "replace" | "reload" | "traverse" ("traverse" == back/forward).
  // Returns an unsubscribe function.
  subscribe: function(handler){
    if(!this._subscribers){
      this._subscribers = [];
    }
    this._subscribers.push(handler);
    return () => {
      this._subscribers = this._subscribers.filter(h => h !== handler);
    };
  },

  //-------------------------------------------------------------------
  // Internals
  //-------------------------------------------------------------------

  // Navigation API "navigate" event handler.
  _onNavigate: function(event){
    const dest = event.destination;
    // Ignore cross-document and non-same-document navigations; we only care
    // about in-app hash routing in Phase 1.
    if(!dest || !dest.sameDocument){
      return;
    }
    // navigationType is the source of truth: "traverse" == back/forward.
    this._emitFromUrl(dest.url, event.navigationType);
  },

  // Fallback "hashchange" handler.
  _onHashChange: function(){
    const token = this._tokenFromUrl(window.location.href);
    // Approximate the navigation type: if this change matches the token we
    // just set programmatically, treat it as "push"; otherwise the user used
    // back/forward, i.e. "traverse".
    const type = token === this._programmaticToken ? "push" : "traverse";
    this._programmaticToken = null;
    this._emitFromUrl(window.location.href, type);
  },

  _emitFromUrl: function(url, type){
    const token = this._tokenFromUrl(url);
    if(this.supported){
      // Clear the programmatic marker once consumed.
      this._programmaticToken = null;
    }
    // Initial restore reconstructed the launch URL: stop replacing, resume
    // pushing for subsequent user navigation.
    if(this._replaceMode && token === this._replaceTarget){
      this.endReplaceMode();
    }
    if(token === this._current){
      return;
    }
    this._current = token;
    (this._subscribers || []).slice().forEach((handler) => {
      try{
        handler(token, type);
      } catch(e){
        console.error("NOC.core.Navigation subscriber failed:", e);
      }
    });
  },

  // Extract the decoded hash payload (without "#") from an absolute URL.
  _tokenFromUrl: function(url){
    let hash;
    try{
      hash = new URL(url, window.location.href).hash;
    } catch{
      hash = "";
    }
    if(!hash){
      return "";
    }
    const raw = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    try{
      return decodeURIComponent(raw);
    } catch{
      return raw;
    }
  },

  _normalize: function(token){
    if(token === undefined || token === null){
      return "";
    }
    const s = String(token);
    return s.charAt(0) === "#" ? s.slice(1) : s;
  },

  // Build an absolute same-document URL that only changes the hash.
  _buildUrl: function(token){
    const loc = window.location;
    return loc.pathname + loc.search + "#" + token;
  },
});
