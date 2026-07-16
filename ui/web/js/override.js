//---------------------------------------------------------------------
// ExtJS overrides
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
NOC.theme = document.getRootNode().documentElement.dataset.theme || "noc";
console.debug("Patching ExtJS " + Ext.getVersion().version);
console.debug("Using theme: " + NOC.theme);
//---------------------------------------------------------------------
// Patches for ExtJS 5.0.0 errors
// Review after any ExtJS upgrade
//---------------------------------------------------------------------

//
// Deferred override queue for classes the *theme* also overrides.
//
// ExtJS is no longer the application root: it is booted on demand by the
// framework-neutral loader via startExtApplication() -> Ext.application()
// (see ui/web/main/desktop/loader/ext-application.js), which runs AFTER
// external.js and after Ext.onReady. The theme overrides of Ext.Component /
// Ext.panel.Table (Ext.theme.neptune/noc.*, concatenated after this file) are
// only finalized during that boot, so any override of those base classes
// applied here at parse time OR in Ext.onReady is clobbered by the theme
// afterwards (verified: the identical override applied from the console, i.e.
// post-boot, sticks and works).
//
// To win, such overrides are queued here and flushed at the very start of
// Ext.application's launch — that runs after class/theme finalization and
// before any application component (grid, form, login view) is created.
// Overrides whose target the theme does NOT touch (Ext.data.Connection,
// Ext.tab.Bar, Ext.grid.header.Container, ...) are applied immediately below
// and do not need this.
//
NOC._deferredExtPatches = [];
(function(){
var origApplication = Ext.application;
Ext.application = function(config){
  config = config || {};
  var origLaunch = config.launch;
  config.launch = function(){
    for(var i = 0; i < NOC._deferredExtPatches.length; i++){
      NOC._deferredExtPatches[i]();
    }
    NOC._deferredExtPatches.length = 0;
    if(origLaunch){
      return origLaunch.apply(this, arguments);
    }
  };
  return origApplication.call(Ext, config);
};
})();

//---------------------------------------------------------------------
// ExtJS core function improvements
//---------------------------------------------------------------------

//
// Override grid column state ids
//
Ext.override(Ext.grid.column.Column, {
  initConfig: function(config){
    if(!Ext.String.endsWith(config.xtype, "column") &&
            config.formatter === undefined
            && !config.renderer){
      config.formatter = "htmlEncode";
    }
    return this.callParent(arguments);
  },
  getStateId: function(){
    return this.stateId || this.dataIndex || this.headerId;
  },
});
//
// Override form field labels
//
//
// Mark required fields and apply style templates
//
Ext.override(Ext.form.field.Base, {
  initComponent: function(){
    var me = this;
    // Apply label style
    if(!me.allowBlank){
      me.labelClsExtra = "noc-label-required";
    }
    // Apply uiStyle
    if(me.uiStyle){
      var style = Ext.apply({}, NOC.uiStyles(me.uiStyle, NOC.theme) || {});
      if(me.labelWidth && style.width && (me.labelAlign === "left" || me.labelAlign === "right")){
        style.width += me.labelWidth;
      }
      if(style.width && me.getTriggers){
        var triggerWidth = NOC.uiTriggers[NOC.theme] || 25, // default theme gray
          triggers = me.getTriggers();
        Ext.Array.each(Object.keys(triggers), function(){
          style.width += triggerWidth;
        });
      }
      Ext.apply(me, style);
    }
    me.callParent();
  },
});

//
// Glyphs in tree column
//
Ext.override(Ext.tree.Column, {
  cellTpl: [
    '<tpl for="lines">',
    '<div class="{parent.childCls} {parent.elbowCls}-img ',
    '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation">',
    "</div>",
    "</tpl>",


    '<div class="{childCls} {elbowCls}-img {elbowCls}',
    '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation">',
    "</div>",
    '<tpl if="checked !== null">',
    '<input type="button" {ariaCellCheckboxAttr}',
    ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
    "</tpl>",


    '<tpl if="glyphCls">' ,
    '<i class="{glyphCls}" style="font-size: 16px"></i> ',
    "<tpl else>",
    '<div role="presentation" class="{childCls} {baseIconCls} ',
    '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
    '<tpl if="icon">style="background-image:url({icon})"</tpl>></div>',
    "</tpl>",
    '<tpl if="href">',
    '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
    "<tpl else>",
    '<span class="{textCls} {childCls}">{value}</span>',
    "</tpl>",
  ],
  initTemplateRendererData: function(value, metaData, record, rowIdx, colIdx, store, view){
    var me = this,
      renderer = me.origRenderer,
      data = record.data,
      parent = record.parentNode,
      rootVisible = view.rootVisible,
      lines = [],
      parentData,
      iconCls = data.iconCls,
      glyphCls;

    while(parent && (rootVisible || parent.data.depth > 0)){
      parentData = parent.data;
      lines[rootVisible ? parentData.depth : parentData.depth - 1] =
            parentData.isLast ? 0 : 1;
      parent = parent.parentNode;
    }

    if(iconCls && iconCls.indexOf("fa fa-") == 0){
      glyphCls = iconCls;
      iconCls = null;
    }

    return {
      record: record,
      baseIconCls: me.iconCls,
      glyphCls: glyphCls,
      iconCls: iconCls,
      icon: data.icon,
      checkboxCls: me.checkboxCls,
      checked: data.checked,
      elbowCls: me.elbowCls,
      expanderCls: me.expanderCls,
      textCls: me.textCls,
      leaf: data.leaf,
      expandable: record.isExpandable(),
      isLast: data.isLast,
      blankUrl: Ext.BLANK_IMAGE_URL,
      href: data.href,
      hrefTarget: data.hrefTarget,
      lines: lines,
      metaData: metaData,
      // subclasses or overrides can implement a getChildCls() method, which can
      // return an extra class to add to all of the cell's child elements (icon,
      // expander, elbow, checkbox).  This is used by the rtl override to add the
      // "x-rtl" class to these elements.
      childCls: me.getChildCls ? me.getChildCls() + " " : "",
      value: renderer ? renderer.apply(me.origScope, arguments) : value,
    };
  },
  treeRenderer: function(value, metaData, record, rowIdx, colIdx, store, view){
    var me = this,
      cls = record.get("cls"),
      rendererData;

    if(cls){
      metaData.tdCls += " " + cls;
    }
    rendererData = me.initTemplateRendererData(value, metaData, record, rowIdx, colIdx, store, view);

    return me.getTpl("cellTpl").apply(rendererData);
  },
});
// Trace events
// if(NOC.settings.traceExtJSEvents){
//   console.log("Enabling event tracing");
//   Ext.mixin.Observable.prototype.fireEvent =
//         Ext.Function.createInterceptor(Ext.mixin.Observable.prototype.fireEvent, function(){
//           console.log("EVENT", this.$className, arguments[0], Array.prototype.slice.call(arguments, 1));
//           console.log("Stack trace:\n" + printStackTrace().join("\n"));
//           return true;
//         });
// }

Ext.define("EXTJS-15862.tab.Bar", {
  override: "Ext.tab.Bar",

  initComponent: function(){
    var me = this,
      initialLayout = me.initialConfig.layout,
      initialAlign = initialLayout && initialLayout.align,
      initialOverflowHandler = initialLayout && initialLayout.overflowHandler;


    if(me.plain){
      me.addCls(me.baseCls + "-plain");
    }


    me.callParent();


    me.setLayout({
      align: initialAlign || (me.getTabStretchMax() ? "stretchmax" :
      me._layoutAlign[me.dock]),
      overflowHandler: initialOverflowHandler || "scroller",
    });


    // We have to use mousedown here as opposed to click event, because
    // Firefox will not fire click in certain cases if mousedown/mouseup
    // happens within btnInnerEl.
    me.on({
      mousedown: me.onClick,
      element: "el",
      scope: me,
    });
  },
});

// Ext.override("Ext.grid.header.Container", {
//   getMenuItems: function(){
//     var me = this,
//       menuItems = me.callParent(arguments); 

//     menuItems.push({
//       text: __("Отменить сортировку"),
//       handler: me.onClearSortClick,
//       scope: me,
//     });

//     return menuItems;
//   },

//   onClearSortClick: function(){
//     var grid = this.up("gridpanel"),
//       store = grid.getStore();

//     store.sorters.clear();
//     store.load();
//   },
// });

//
// Disable the native per-grid/tree load overlay (loadMask). Store traffic
// flows through NOC.api and is indicated by the shared #noc-api-bar spinner.
// Instead of the .x-mask overlay, a grid is disabled (blocked from
// interaction) while its store performs a FULL load — reusing the
// disable()/enable() semantics of Component#mask below.
//
// Only beforeload/load are bound (initial load, sort, filter, reload).
// Buffered-scroll prefetch (cachemiss/cachefilled) is intentionally NOT
// bound, so scrolling a BufferedStore stays usable. Trees are skipped so
// node-expand loads don't block the whole tree.
//
// Deferred to Ext.application launch (see NOC._deferredExtPatches above):
// Ext.panel.Table is itself overridden by the theme
// (Ext.theme.neptune.panel.Table, concatenated after this file), which
// clobbers an override applied here at parse time or in Ext.onReady (verified:
// _nocBindLoadBlocker was absent from the prototype at runtime with both
// forms). The flush runs after theme finalization and before any grid is
// created, and our initComponent's callParent chains onto the theme's.
//
NOC._deferredExtPatches.push(function(){
  Ext.override(Ext.panel.Table, {
    loadMask: false,

    initComponent: function(){
      this.callParent(arguments);
      if(!this.isTree){
        this._nocBindLoadBlocker();
        this.on({
          afterrender: this._nocBindLoadBlocker,
          reconfigure: this._nocBindLoadBlocker,
          scope: this,
        });
      }
    },

    _nocBindLoadBlocker: function(){
      var me = this,
        store = me.getStore && me.getStore();
      if(store === me._nocBlockStore){
        return;
      }
      if(me._nocBlockStore){
        me.mun(me._nocBlockStore, "beforeload", me._nocOnBeforeLoad, me);
        me.mun(me._nocBlockStore, "load", me._nocOnLoad, me);
      }
      me._nocBlockStore = store || null;
      if(store){
        // managed listeners: auto-removed when the grid is destroyed
        me.mon(store, "beforeload", me._nocOnBeforeLoad, me);
        me.mon(store, "load", me._nocOnLoad, me);
      }
    },

    _nocOnBeforeLoad: function(){
      if(!this.destroying && !this.destroyed){
        this.mask();
      }
    },

    _nocOnLoad: function(){
      this.unmask();
    },
  });
});

//
// Redefine Component#mask / #unmask: instead of rendering the native
// .x-mask overlay, disable() / enable() the component. Loading is indicated
// globally by #noc-api-bar; the per-element "mask" only blocks interaction
// (prevents double-submit / clicks while a request is in flight).
//
// maskOnDisable is forced off, which is essential here:
//   1. A disabled component already blocks interaction via the
//      x-item-disabled class (pointer-events:none), so no overlay is needed
//      — matching "disable without the native spinner/overlay".
//   2. Ext.Component#onDisable calls me.mask() when maskOnDisable is true.
//      With mask() routed to disable() that would recurse forever
//      (mask -> disable -> onDisable -> mask -> ...). Turning it off breaks
//      the cycle in both directions (onEnable -> unmask is gated the same way).
//
// Reference-counted so overlapping mask() calls don't enable() early, and a
// component disabled by application logic stays disabled after unmask().
//
// Deferred to Ext.application launch (see NOC._deferredExtPatches above).
// Unlike EXTJS-15862.tab.Bar / Override.grid.header.Container above,
// Ext.Component is itself overridden by the theme (Ext.theme.neptune.Component
// / Ext.theme.noc.Component, both override:"Ext.Component") concatenated AFTER
// this file, and — because ExtJS is booted late via Ext.application — that
// theme override is only finalized during boot, after both parse time and
// Ext.onReady. The immediate Ext.override, the deferred
// Ext.define(override:"Ext.Component") and the Ext.onReady forms were all
// clobbered by the theme (verified in-runtime: the very same override applied
// from the console, i.e. after boot, sticks and works). Flushing at launch
// wins.
//
// Only the public Component#mask/#unmask is redefined. Ext.LoadMask
// (Component#setLoading, and the explicit instances in NOC.core.MRT /
// NOC.sa.managedobject.ScriptPanel showing "Running task...") renders
// independently and is intentionally untouched.
//
NOC._deferredExtPatches.push(function(){
  Ext.override(Ext.Component, {
    maskOnDisable: false,

    // mask()/unmask() are idempotent, matching the historical overlay
    // semantics they replace: the native overlay coalesced repeated mask()
    // calls into a single overlay that one unmask() fully cleared. A lot of
    // app code relies on this (mask() several times, unmask() once) — e.g.
    // fm/alarm ApplicationController masks a grid on each of several filter
    // bindings during first render, while its BufferedStore load fires only
    // one completion callback. A reference count would leave such a grid
    // permanently disabled (N masks, 1 unmask). So instead of counting we
    // track only whether *we* disabled the component (_maskDidDisable), which
    // also preserves an app-logic disabled state across unmask().
    //
    // disable()/enable() are called with silent=true so masking does NOT fire
    // the disable/enable events. Historically mask() never fired those events;
    // some components wire string listeners on them (e.g. core/InlineGrid.js:
    // {disable:"onDisable", enable:"onEnable"}) that resolve to an ancestor
    // view controller which may not implement the handler — firing here would
    // throw "No method named onDisable on ...". The x-item-disabled class, the
    // onDisable()/onEnable() methods and the interaction block are all still
    // applied; only the events are suppressed.
    mask: function(){
      var me = this;
      if(!me._maskDidDisable && !me.disabled){
        me._maskDidDisable = true;
        me.disable(true);
      }
    },

    unmask: function(){
      var me = this;
      if(me._maskDidDisable){
        me._maskDidDisable = false;
        me.enable(true);
      }
    },
  });
});

//
// ExtJS 6.0.1: CheckboxModel#onHeaderClick ignores showHeaderCheckbox:false —
// the flag only hides the checkbox visual, while a click on the (empty)
// checkbox column header still triggers selectAll/deselectAll. selectAll()
// then crashes on a BufferedStore-backed grid (Ext.selection.Model#selectAll
// -> store.getRange -> rangeCached/hasRange walks the page map and hits an
// uncached page: "me.getPage(...) is undefined"). Seen on the sa.managedobject
// selection grid (checkboxmodel, MULTI, showHeaderCheckbox:false, buffered
// selectionStore). Backport of the later ExtJS behaviour: respect the flag.
//
// Deferred to Ext.application launch: the theme overrides
// Ext.theme.noc.selection.CheckboxModel, so a parse-time override of the same
// class would be clobbered (see NOC._deferredExtPatches above).
//
NOC._deferredExtPatches.push(function(){
  Ext.override(Ext.selection.CheckboxModel, {
    onHeaderClick: function(){
      if(this.showHeaderCheckbox === false){
        return;
      }
      this.callParent(arguments);
    },
  });
});

//
// Route Ext.data.Connection.request (and therefore Ext.Ajax and all
// Ext.data.proxy.Ajax / Rest proxies used by stores and combos) through
// NOC.api.requestLegacy — a fetch-based transport. This eliminates the
// last XHR path in the app and unifies store/proxy traffic with the
// #noc-api-bar in-flight indicator.
//
Ext.override(Ext.data.Connection, {
  request: function(options){
    options = options || {};
    var scope = options.scope,
      origSuccess = options.success,
      origFailure = options.failure,
      origCallback = options.callback,
      url = options.url,
      hasBody = options.jsonData !== undefined
                || options.rawData !== undefined
                || options.params !== undefined,
      method = (options.method || (hasBody ? "POST" : "GET")).toUpperCase(),
      params = options.params;

    // GET requests carry params in the query string, not the body
    if(method === "GET" && params !== undefined){
      var qs = typeof params === "string" ? params : Ext.Object.toQueryString(params);
      if(qs){
        url = url + (url.indexOf("?") === -1 ? "?" : "&") + qs;
      }
      params = undefined;
    }

    NOC.api.requestLegacy({
      url: url,
      method: method,
      jsonData: options.jsonData,
      params: params,
      defaultPostHeader: options.defaultPostHeader,
      success: function(response){
        if(typeof origSuccess === "function"){
          origSuccess.call(scope, response, options);
        }
        if(typeof origCallback === "function"){
          origCallback.call(scope, options, true, response);
        }
      },
      failure: function(response){
        if(typeof origFailure === "function"){
          origFailure.call(scope, response, options);
        }
        if(typeof origCallback === "function"){
          origCallback.call(scope, options, false, response);
        }
      },
    });

    // Stub handle: current fetch-based transport does not expose abort()
    return {abort: Ext.emptyFn, isLoading: function(){ return false; }};
  },
});

Ext.define("Override.grid.header.Container", {
  override: "Ext.grid.header.Container",
    
  //   getMenuItems: function(){
  //     var me = this,
  //       menuItems = me.callParent(arguments),
  //       column = me.getMenu().activeHeader;
        
  //     // Добавляем новый пункт для отмены сортировки, если колонка отсортирована
  //     if(column && column.isSortable() !== false && column.sortState){
  //       menuItems.push({
  //         text: "Отменить сортировку",
  //         iconCls: "x-fa fa-ban", // Можно использовать другую иконку
  //         handler: function(){
  //           // Удаляем текущую сортировку
  //           var grid = column.up("grid"),
  //             store = grid.getStore();
                    
  //           // Сбрасываем состояние сортировки колонки
  //           column.setSortState(null);
                    
  //           // Если нужно также обновить хранилище
  //           if(store.sorters){
  //             store.sorters.removeAtKey(column.dataIndex);
  //             store.load();
  //           }
  //         },
  //       });
  //     }
        
  //     return menuItems;
  //   },

  getMenuItems: function(){
    var me = this,
      menuItems = me.callParent(arguments); 

    menuItems.unshift({
      text: __("Cancel Sort"),
      iconCls: "x-hmenu-sort-cancel",
      handler: me.onClearSortClick,
      scope: me,
    });

    return menuItems;
  },

  onClearSortClick: function(){
    var grid = this.up("gridpanel, treepanel"),
      store = grid.getStore(),
      state = Ext.clone(grid.getState()),
      columns = grid.getHeaderContainer().getVisibleGridColumns();
    
    store.sorters.clear();
    Ext.Array.each(columns, function(column){
      if(column.sortState){
        column.setSortState(null);
      }
    });
    if(Ext.isDefined(state.storeState)){
      delete state.storeState.sorters;
    }
    grid.saveState(state);
  },
});