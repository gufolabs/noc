//---------------------------------------------------------------------
// Framework-neutral event bus
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Replaces Ext.GlobalEvents for cross-component communication.
// No dependency on ExtJS or any UI framework.
//
// API exposed on window.NOC.events:
//   on(event, fn)      → unsubscribe()   (subscribe; returns cleanup fn)
//   off(event, fn)     → void            (explicit unsubscribe)
//   emit(event, ...args) → void          (fire to all listeners)
//
// Rule for Vue/Lit components:
//   const off = NOC.events.on("someEvent", handler);
//   onUnmounted(off);
//---------------------------------------------------------------------

const _handlers = new Map();

function on(event, fn){
  if(!_handlers.has(event)) _handlers.set(event, new Set());
  _handlers.get(event).add(fn);
  return () => off(event, fn);
}

function off(event, fn){
  _handlers.get(event)?.delete(fn);
}

function emit(event, ...args){
  for(const fn of(_handlers.get(event) ?? [])) fn(...args);
}

export const events = {on, off, emit};
