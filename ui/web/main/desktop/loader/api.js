//---------------------------------------------------------------------
// Framework-neutral HTTP client
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Replaces Ext.Ajax in the neutral infrastructure and provides a
// legacy bridge for incremental migration of ExtJS callsites.
//
// Modern interface:
//   import { request } from "./api.js";
//   const data = await request("/api/foo/");           // GET, returns parsed JSON
//   const data = await request("/api/foo/", {          // POST with JSON body
//     method: "POST", body: JSON.stringify(payload),
//   });
//
// Legacy bridge (drop-in for Ext.Ajax.request):
//   NOC.api.requestLegacy({ url, method, jsonData, params, success, failure, callback, scope })
//   Builds a response-like object: { responseText, status, getResponseHeader }
//   so existing Ext.decode(response.responseText) callsites work unchanged.
//---------------------------------------------------------------------

class ApiError extends Error{
  constructor(status, statusText, responseText){
    super(`HTTP ${status} ${statusText}`);
    this.status = status;
    this.responseText = responseText;
  }
}

// In-flight request counter. Notifies registered listeners when the first
// request starts (active=true) and when the last one completes (active=false).
let _inFlight = 0;
const _loadingListeners = new Set();

function _notifyLoading(active){
  _loadingListeners.forEach(fn => fn(active));
}

function _begin(){
  if(++_inFlight === 1) _notifyLoading(true);
}

function _end(){
  if(--_inFlight === 0) _notifyLoading(false);
}

// Register a callback invoked with (true) when requests start and (false) when
// all complete. Returns an unsubscribe function.
export function onLoading(fn){
  _loadingListeners.add(fn);
  return () => _loadingListeners.delete(fn);
}

// Modern fetch wrapper. Resolves with parsed JSON (or plain text when the
// response is not JSON). Rejects with ApiError on 4xx/5xx.
export async function request(url, {
  method = "GET",
  body = undefined,
  headers = {},
} = {}){
  const init = {method, headers: {...headers} };
  if(body !== undefined){
    init.body = body;
    if(!init.headers["Content-Type"]){
      init.headers["Content-Type"] = "application/json";
    }
  }
  _begin();
  try{
    const res = await fetch(url, init);
    const text = await res.text();
    if(!res.ok){
      throw new ApiError(res.status, res.statusText, text);
    }
    const ct = res.headers.get("content-type") || "";
    if(ct.includes("/json")){
      try{
        return JSON.parse(text);
      } catch{
        return text;
      }
    }
    return text;
  } finally{
    _end();
  }
}

// Legacy bridge that mirrors the Ext.Ajax.request({ url, method, jsonData,
// params, defaultPostHeader, success, failure, callback, scope }) signature.
//
// Behavioral contract matches ExtJS:
//   - success is called for 2xx responses (including 202)
//   - failure is called for 4xx/5xx responses
//   - callback is called after success or failure (string → looked up on scope)
//   - response object shape: { responseText, status, getResponseHeader(name) }
export function requestLegacy(cfg){
  const {
    url,
    method = "GET",
    jsonData,
    params,
    defaultPostHeader,
    success,
    failure,
    callback,
    scope,
  } = cfg;

  let body, contentType;
  if(jsonData !== undefined){
    body = JSON.stringify(jsonData);
    contentType = "application/json";
  } else if(params !== undefined){
    body = typeof params === "string" ? params : new URLSearchParams(params).toString();
    contentType = defaultPostHeader || "application/x-www-form-urlencoded";
  }

  const headers = {};
  if(contentType) headers["Content-Type"] = contentType;

  const init = {method, headers};
  if(body !== undefined) init.body = body;

  const invoke = (fn, response) => {
    if(typeof fn === "function") fn.call(scope, response);
  };

  const invokeCallback = (response) => {
    if(!callback) return;
    const fn = typeof callback === "function"
      ? callback
      : (scope && typeof scope[callback] === "function" ? scope[callback] : null);
    if(fn) fn.call(scope, response);
  };

  _begin();
  fetch(url, init)
    .then(async(res) => {
      const text = await res.text();
      const response = {
        status: res.status,
        responseText: text,
        getResponseHeader: (name) => res.headers.get(name),
      };
      if(res.ok){
        invoke(success, response);
      } else{
        invoke(failure, response);
      }
      invokeCallback(response);
    })
    .catch(() => {
      const response = {status: 0, responseText: "", getResponseHeader: () => null};
      invoke(failure, response);
      invokeCallback(response);
    })
    .finally(() => _end());
}

export const api = {request, requestLegacy, onLoading};
