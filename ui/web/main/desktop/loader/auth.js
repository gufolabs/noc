//---------------------------------------------------------------------
// Framework-neutral auth / session module
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Manages authentication state and provides reactive session info.
// This module has no dependency on ExtJS or any UI framework.
//
// API exposed on window.NOC.auth:
//   checkIsLogged()              → Promise<boolean>  (hits /api/login/is_logged/)
//   setUserInfo({username, email}) → void            (call after loading user_settings)
//   getSession()                 → { isLogged, username, email }  (snapshot)
//   onSessionChange(fn)          → unsubscribe()     (fn receives session snapshot)
//
// Rule for Vue/Lit components:
//   const unsub = NOC.auth.onSessionChange(handler);
//   onUnmounted(unsub);
//---------------------------------------------------------------------

import {api} from "./api.js";

let _session = {isLogged: false, username: null, email: null};
const _listeners = new Set();

function _notify(){
  const snapshot = {..._session};
  for(const fn of _listeners) fn(snapshot);
}

async function checkIsLogged(){
  const result = await api.request("/api/login/is_logged/");
  _session.isLogged = !!result;
  _notify();
  return _session.isLogged;
}

function setUserInfo({username, email}){
  _session.username = username;
  _session.email = email;
  _notify();
}

function getSession(){
  return {..._session};
}

function onSessionChange(fn){
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export const auth = {checkIsLogged, setUserInfo, getSession, onSessionChange};
