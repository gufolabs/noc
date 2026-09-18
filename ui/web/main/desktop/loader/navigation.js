//---------------------------------------------------------------------
// Framework-neutral navigation module
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Wraps the browser Navigation API (window.navigation) and provides a
// small, stable routing surface used across the app.
//
// Extracted from NOC.core.Navigation (core/Navigation.js). The ExtJS wrapper
// in that file is now a thin shim; all logic lives here.
//
//   getToken()               -> current route (hash without leading "#")
//   navigate(token, options) -> change route (push by default)
//   subscribe(handler)       -> observe route changes, returns unsubscribe
//   init()                   -> start observing
//---------------------------------------------------------------------

export const navigation = {
  // True when the native Navigation API is fully available (including event support).
  // Getter so it is evaluated fresh on each access, not cached at module load time.
  get supported(){
    return typeof window !== "undefined" && typeof window.navigation?.addEventListener === "function";
  },
  _subscribers: null,
  _current: "",
  _onNavigateBound: null,
  _onHashChangeBound: null,
  _initialized: false,
  _silent: false,
  _replaceMode: false,
  _replaceTarget: null,
  _replaceTimer: null,
  _programmaticToken: null,

  // Start observing route changes. Idempotent. Returns this.
  init(){
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
    this._initialized = true;
    return this;
  },

  // Tear down listeners. Mainly for tests / hot reload.
  destroy(){
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
  getToken(){
    return this._tokenFromUrl(window.location.href);
  },

  // Change the current route.
  //   token   - new route string (hash payload, without "#")
  //   options - { replace: bool, dedup: bool }
  navigate(token, options){
    const opts = options || {},
      next = this._normalize(token);
    if(this._silent){
      return false;
    }
    if(opts.dedup && next === this.getToken()){
      return false;
    }
    const url = this._buildUrl(next),
      replace = opts.replace || this._replaceMode;
    this._programmaticToken = next;
    if(this.supported){
      window.navigation.navigate(url, {
        history: replace ? "replace" : "push",
      });
    } else{
      if(replace){
        window.location.replace(url);
      } else{
        window.location.hash = next;
      }
    }
    return true;
  },

  // Enter replace mode for the duration of the initial app launch/restore.
  beginReplaceMode(){
    this._replaceMode = true;
    this._replaceTarget = this.getToken();
    if(this._replaceTimer){
      clearTimeout(this._replaceTimer);
    }
    this._replaceTimer = setTimeout(() => this.endReplaceMode(), 8000);
  },

  endReplaceMode(){
    this._replaceMode = false;
    this._replaceTarget = null;
    if(this._replaceTimer){
      clearTimeout(this._replaceTimer);
      this._replaceTimer = null;
    }
  },

  // Run fn while suppressing any navigate() calls it triggers.
  silent(fn){
    const prev = this._silent;
    this._silent = true;
    try{
      fn();
    } finally{
      this._silent = prev;
    }
  },

  // Subscribe to route changes. handler(token, type).
  // Returns an unsubscribe function — callers MUST invoke it when the
  // subscribing component is torn down, otherwise dead handlers accumulate.
  //
  // Component pattern:
  //   onMounted(() => {
  //     const unsub = NOC.navigation.subscribe(handler);
  //     onUnmounted(unsub);
  //   });
  //
  // ExtJS Application (singleton, lives for the page session) may omit unsub.
  subscribe(handler){
    if(!this._subscribers){
      this._subscribers = [];
    }
    this._subscribers.push(handler);
    return () => {
      this._subscribers = this._subscribers.filter(h => h !== handler);
    };
  },

  _onNavigate(event){
    const dest = event.destination;
    if(!dest || !dest.sameDocument){
      return;
    }
    this._emitFromUrl(dest.url, event.navigationType);
  },

  _onHashChange(){
    const token = this._tokenFromUrl(window.location.href);
    const type = token === this._programmaticToken ? "push" : "traverse";
    this._programmaticToken = null;
    this._emitFromUrl(window.location.href, type);
  },

  _emitFromUrl(url, type){
    const token = this._tokenFromUrl(url);
    if(this.supported){
      this._programmaticToken = null;
    }
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
        console.error("NOC navigation subscriber failed:", e);
      }
    });
  },

  _tokenFromUrl(url){
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

  _normalize(token){
    if(token === undefined || token === null){
      return "";
    }
    const s = String(token);
    return s.charAt(0) === "#" ? s.slice(1) : s;
  },

  _buildUrl(token){
    const loc = window.location;
    return loc.pathname + loc.search + "#" + token;
  },
};
