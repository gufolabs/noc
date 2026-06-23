//---------------------------------------------------------------------
// NOC.core.Application
//---------------------------------------------------------------------
// Copyright (C) 2007-2011 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.core.Application");

Ext.define("NOC.core.Application", {
  extend: "Ext.panel.Panel",
  layout: "fit",
  permissions: {}, // User permissions
  navTooltipTemplate: undefined,
  themeBodyPadding: 4,

  constructor: function(options){
    var me = this;
    // Initialize templates when exists
    me.appId = me.appId || options.noc.app_id;
    me.templates = NOC.templates[me.appId.replace(".", "_")];
    // Set up permissions before calling initComponent
    me.permissions = {};
    for(var p in options.noc.permissions){
      me.permissions[options.noc.permissions[p]] = true;
    }
    // Fix custom fields regex
    if(options.noc.cust_form_fields){
      Ext.iterate(options.noc.cust_form_fields, function(obj){
        if(obj.regex){
          obj.regex = new RegExp(obj.regex);
        }
      });
    }
    me.appTitle = options.title;
    me.noc = options.noc;
    me._registeredItems = [];
    me.currentHistoryHash = me.appId;
    me.callParent(options);
  },
  //
  initComponent: function(){
    var me = this;
    me.on("afterrender", me.processCommands, me);
    me.callParent();
  },
  //
  hasPermission: function(name){
    return this.permissions[name] === true;
  },
  // Filter items and hide not available
  applyPermissions: function(items){
    var me = this;
    Ext.each(items, function(i){
      if(Ext.isDefined(i.hasAccess) && !i.hasAccess(me)){
        // Hide item
        i.hidden = true;
      }
    });
    return items;
  },
  // Register new item and return id
  registerItem: function(item){
    var me = this,
      items = me._registeredItems;
    if(Ext.isString(item)){
      item = Ext.create(item, {app: me});
    }
    var itemId = items.push(item) - 1;
    me._registeredItems = items;
    return itemId;
  },
  //
  showItem: function(index){
    var me = this;
    if(index === null || index === undefined){
      return undefined;
    }
    me.getLayout().setActiveItem(index);
    return me.items.items[index];
  },
  //
  previewItem: function(index, record){
    var me = this,
      back = me.getLayout().getActiveItem(),
      item = me.showItem(index);
    item.preview(record, back);
    me.reflectItemInUrl(item, record);
    return item;
  },
  // Reflect a card-layout sub-view (a registered item that declares a
  // urlSuffix) in the URL as "<appId>/<id>/<urlSuffix>". No-op for items
  // without a urlSuffix, so it is safe to call generically. Uses dedup so it
  // does not push a duplicate history entry while restoring from the URL.
  reflectItemInUrl: function(item, record){
    var me = this;
    if(!item || !item.urlSuffix || !record || !me.appId){
      return;
    }
    var idField = me.idField || "id",
      id = Ext.isFunction(record.get) ? record.get(idField) : record[idField];
    if(id === undefined || id === null){
      return;
    }
    me.currentHistoryHash = [me.appId, id, item.urlSuffix].join("/");
    NOC.navigation.navigate(me.currentHistoryHash, {dedup: true});
  },
  //
  getRegisteredItems: function(){
    var me = this;
    return me._registeredItems;
  },
  //
  getRegisteredItem: function(index){
    return this._registeredItems[index];
  },
  //
  getRegisteredItemByUrl: function(suffix){
    var me = this;
    return me._registeredItems.findIndex(function(item){
      return item.urlSuffix === suffix;
    });
  },
  //
  processCommands: function(){
    var me = this,
      cmd = me.getCmd();
    if(cmd){
      var handler = me["onCmd_" + cmd];
      if(Ext.isFunction(me.noc.cmd.callback)){
        me.noc.cmd.callback();
      }
      // Override close handler for sa.managedobject and fm.alarm only!
      if(["sa.managedobject", "fm.alarm"].includes(me.appId) &&
        !Ext.isEmpty(me.noc.cmd.override)){
        if(me.appId === "sa.managedobject"){
          me.down("[xtype=managedobject.form]").getController().toMain = function(){
            me.up().close();
          }
        }
        if(me.appId === "fm.alarm"){
          me.down("[xtype=fm.alarm.form]").getController().onClose = function(){
            me.up().close();
          }
        }
      }
      if(Ext.isFunction(handler)){
        handler.call(me, me.noc.cmd);
      }
    }
  },
  //
  getHistoryHash: function(){
    var me = this;
    return me.currentHistoryHash;
  },
  //
  setHistoryHash: function(){
    this.currentHistoryHash = [this.appId].concat([].slice.call(arguments, 0)).join("/");
    // dedup: never push a duplicate entry for the URL we are already on. This
    // also keeps back/forward clean when restore handlers re-assert the same
    // token asynchronously.
    NOC.navigation.navigate(this.currentHistoryHash, {dedup: true});
    if(arguments.length === 0){
      this.setQueryParam();
    }
  },
  // Apply a history token to this app (back/forward or deep-link). args are the
  // path segments after the appId. Default routing for core.Application apps;
  // subclasses override for app-specific restore.
  applyHistory: function(args){
    var me = this;
    if(Ext.isFunction(me.restoreHistory)){
      me.restoreHistory(args || []);
    } else if(Ext.isFunction(me.onCmd_history)){
      me.onCmd_history({args: args || []});
    } else{
      // Filter-only apps (e.g. sa.monitor, sa.getnow): re-apply the filter
      // carried in the URL query.
      me.restoreFilterFromUrl();
    }
  },
  // Re-apply the filter encoded in the URL query to the app's filter panel
  // (reference "filterPanel" with a controller exposing restoreFilter()).
  // No-op for apps without such a panel.
  restoreFilterFromUrl: function(){
    var fp = Ext.isFunction(this.lookup) ? this.lookup("filterPanel") : null,
      ctrl = fp && Ext.isFunction(fp.getController) ? fp.getController() : null;
    if(ctrl && Ext.isFunction(ctrl.restoreFilter)){
      ctrl.restoreFilter();
    }
  },
  //
  setQueryParam: function(){
    let filterPanel = this.lookup("filterPanel");
    if(Ext.isEmpty(filterPanel)){
      return;
    }
    let filterVm = filterPanel.getViewModel();
    if(Ext.isEmpty(filterVm)){
      return;
    }
    let filter = filterVm.get("filterObject");
    if(Ext.Object.isEmpty(filter)){
      return
    }
    this.getController().saveFilterToUrl(filter);
  },
  //
  onCloseApp: function(){},
  //
  getCmd: function(){
    var me = this;
    return (me.noc.cmd && me.noc.cmd.cmd) ? me.noc.cmd.cmd : null;
  },
  //
  log: function(){
    var me = this,
      msg = [me.$className + ":"];
    for(var i = 0; i < arguments.length; i++){
      msg.push(arguments[i]);
    }
    console.log.apply(console, msg);
  },
  // Check application tab is active
  isActiveApp: function(){
    var me = this;
    return me.ownerCt.isVisible();
  },
  //
  setNavTabTooltip: function(ctx){
    var me = this,
      txt;
    if(!me.navTooltipTemplate){
      return
    }
    ctx = ctx || {};
    ctx["title"] = me.appTitle;
    txt = me.navTooltipTemplate.apply(ctx).trim();
    if(txt === ""){
      me.clearNavTabTooltip()
    } else{
      NOC.app.app.setActiveNavTabTooltip(txt)
    }
  },
  //
  clearNavTabTooltip: function(){
    NOC.app.app.clearActiveNavTabTooltip();
  },
});
