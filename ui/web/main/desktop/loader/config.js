//---------------------------------------------------------------------
// Framework-neutral application config module
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// Loads and caches the server-side application config from
// /main/desktop/settings/. Requires the user to be authenticated.
//
// API exposed on window.NOC.config:
//   loadConfig()   → Promise<object>  (fetches /main/desktop/settings/, caches result)
//   getConfig()    → object | null    (raw server response; null before first load)
//   getSettings()  → object | null    (mapped NOC.settings shape; null before first load)
//---------------------------------------------------------------------

import {api} from "./api.js";

let _config = null;
let _settings = null;

async function loadConfig(){
  _config = await api.request("/main/desktop/settings/");
  _settings = _buildSettings(_config);
  return _config;
}

function getConfig(){
  return _config;
}

function getSettings(){
  return _settings;
}

function _buildSettings(s){
  return {
    systemId: s.system_uuid ? s.system_uuid : null,
    brand: s.brand,
    features: s.features || [],
    installation_name: s.installation_name,
    preview_theme: s.preview_theme,
    language: s.language,
    branding_color: s.branding_color,
    branding_background_color: s.branding_background_color,
    enable_search: s.enable_search,
    gitlab_url: s.gitlab_url,
    collections: {
      allow_sharing: s.collections?.allow_sharing,
      allow_overwrite: s.collections?.allow_overwrite,
      project_id: s.collections?.project_id,
    },
    gis: {
      base: {
        enable_blank: s.gis?.base?.enable_blank,
        enable_osm: s.gis?.base?.enable_osm,
        enable_google_roadmap: s.gis?.base?.enable_google_roadmap,
        enable_google_hybrid: s.gis?.base?.enable_google_hybrid,
        enable_google_sat: s.gis?.base?.enable_google_sat,
        enable_google_terrain: s.gis?.base?.enable_google_terrain,
        enable_tile1: s.gis?.base?.enable_tile1,
        enable_tile2: s.gis?.base?.enable_tile2,
        enable_tile3: s.gis?.base?.enable_tile3,
        enable_yandex_roadmap: s.gis?.base?.enable_yandex_roadmap,
        enable_yandex_hybrid: s.gis?.base?.enable_yandex_hybrid,
        enable_yandex_sat: s.gis?.base?.enable_yandex_sat,
      },
      custom: {
        tile1: {
          name: s.gis?.custom?.tile1?.name,
          url: s.gis?.custom?.tile1?.url,
          subdomains: s.gis?.custom?.tile1?.subdomains,
        },
        tile2: {
          name: s.gis?.custom?.tile2?.name,
          url: s.gis?.custom?.tile2?.url,
          subdomains: s.gis?.custom?.tile2?.subdomains,
        },
        tile3: {
          name: s.gis?.custom?.tile3?.name,
          url: s.gis?.custom?.tile3?.url,
          subdomains: s.gis?.custom?.tile3?.subdomains,
        },
      },
      yandex_supported: s.gis?.yandex_supported,
      default_layer: s.gis?.default_layer,
    },
    traceExtJSEvents: s.traceExtJSEvents,
    helpUrl: s.helpUrl,
    helpBranch: s.helpBranch,
    helpLanguage: s.helpLanguage,
    timezone: s.timezone,
    enable_remote_system_last_extract_info: s.enable_remote_system_last_extract_info,
    enableHelp: s.helpUrl && s.helpUrl !== "",
    has_geocoder: s.has_geocoder,
    color_scheme: s.color_scheme || {},
  };
}

export const config = {loadConfig, getConfig, getSettings};
