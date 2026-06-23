//---------------------------------------------------------------------
// ExtJS application module
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
// ExtJS is no longer the root of the application. It is started on demand
// by the framework-neutral loader (index -> bootstrap -> ui-loader), which
// invokes startExtApplication() once the runtime is ready. This is the first
// step of the ExtJS migration: ExtJS becomes one of the loaded modules
// instead of owning the application start.
//---------------------------------------------------------------------

import {auth} from "./auth.js";
import {config} from "./config.js";

// Starts the legacy ExtJS application. Must be called after the global Ext
// runtime (window.Ext, provided by external.js) is available.
export function startExtApplication(){
  Ext.application({
    name: "NOC",
    paths: {
      "NOC": "/ui/web",
      "Ext.ux": "/ui/web/ux",
    },

    requires: [
      "NOC.main.desktop.Application",
      "NOC.main.desktop.LoginView",
    ],

    launch: async function(){
      try{
        const isLogged = await auth.checkIsLogged();
        if(isLogged){
          this.openApplication();
          return;
        }
        var hash = location.hash,
          newUrl = location.protocol + "//" + location.host + "?uri=/" + hash;
        history.replaceState({}, document.title, newUrl);
        this.openLogin();
      } catch(err){
        console.error("Request failed:", err);
      }
    },
    openApplication: function(){
      Ext.setGlyphFontFamily("FontAwesome");
      console.log("Initializing navigation");
      // Navigation API migration (Phase 1, hash-based URLs). This replaces the
      // former Ext.History facade; see ui/docs/navigation-api-migration.md
      NOC.navigation.init();
      console.log("NOC application starting");
      this.settings();
    },
    openLogin: function(){
      console.log("NOC login starting");
      Ext.create("NOC.main.desktop.LoginView", {
        listeners: {
          scope: this,
          afterRender: this.hideSplashScreen,
        },
      });
      console.log("NOC login started");
    },
    settings: async function(){
      try{
        await config.loadConfig();
        console.log("!!!");
        console.log("!!! Running NOC desktop");
        console.log("!!!");
        Ext.BLANK_IMAGE_URL = "/ui/web/img/s.gif";
        NOC.settings = config.getSettings();
        NOC.templates = {};
        document.title = NOC.settings.brand + "|" + NOC.settings.installation_name;
        this.createCss(NOC.settings.color_scheme);
        this.app = Ext.create("NOC.main.desktop.Application", {
          listeners: {
            scope: this,
            applicationReady: this.hideSplashScreen,
          },
        });
      } catch(err){
        console.error("Request failed:", err);
      }
    },
    hideSplashScreen: function(){
      var mask = Ext.get("noc-loading-mask"),
        parent = Ext.get("noc-loading");
      mask.fadeOut({
        callback: function(){
          mask.destroy();
        },
      });
      parent.fadeOut({
        callback: function(){
          parent.destroy();
        },
      });
    },
    createCss: function(scheme){
      var classes = scheme.style || [],
        style = document.createElement("style"),
        root = document.documentElement,
        css = "";
      classes.forEach(cl => {
        css += `.${cl.name}, .${cl.name} td{`;
        if(!(Object.hasOwn(cl, "fontWeight") || Object.hasOwn(cl, "font-weight"))){
          cl.fontWeight = "normal";
        }
        if(!(Object.hasOwn(cl, "fontStyle") || Object.hasOwn(cl, "font-style"))){
          cl.fontStyle = "normal";
        }
        if(!(Object.hasOwn(cl, "textDecoration") || Object.hasOwn(cl, "text-decoration"))){
          cl.textDecoration = "none";
        }
        Object.entries(cl)
          .filter((name) => name[0] !== "name")
          .forEach(([key, value]) => {
            switch(key){
              case "color":
                css += `color: var(--${cl.name});`;
                root.style.setProperty(`--${cl.name}`, value);
                break;
              case "background-color":
              case "backgroundColor": {
                let v = `${cl.name}-bg`;
                css += `background-color: var(--${v});`;
                root.style.setProperty(`--${v}`, value);
                break;
              }
              case "font-weight":
              case "fontWeight": {
                let v = `${cl.name}-fw`;
                css += `font-weight: var(--${v});`;
                root.style.setProperty(`--${v}`, value);
                break;
              }
              case "font-style":
              case "fontStyle": {
                let v = `${cl.name}-fs`;
                css += `font-style: var(--${v});`;
                root.style.setProperty(`--${v}`, value);
                break;
              }
              case "text-decoration":
              case "textDecoration": {
                let v = `${cl.name}-td`;
                css += `text-decoration: var(--${v});`;
                root.style.setProperty(`--${v}`, value);
                break;
              }
              default:
                css += `${key}: ${value}; `;
            }
          });
        css += "} ";
      });
      if(style.styleSheet){
        style.styleSheet.cssText = css;
      } else{
        style.appendChild(document.createTextNode(css));
      }
      document.getElementsByTagName("head")[0].appendChild(style);
    },
  });
}
