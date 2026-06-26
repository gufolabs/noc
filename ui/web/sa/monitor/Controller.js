//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.monitor.Controller");
Ext.define("NOC.sa.monitor.Controller", {
  extend: "Ext.app.ViewController",
  alias: "controller.monitor",
  pollingInterval: 300000, // msec

  mixins: [
    "NOC.core.mixins.Export",
    "NOC.core.mixins.Polling",
  ],

  onShowFilter: function(){
    this.lookupReference("filterPanel").toggleCollapse();
  },

  onSelectionChange: function(element, selected){
    this.getViewModel().set("total.selection", selected.length);
  },

  onSelectAll: function(){
    var selectionGrid = this.lookupReference("selectionGrid");
    var renderPlugin = selectionGrid.findPlugin("bufferedrenderer");

    selectionGrid.getSelectionModel().selectRange(0, renderPlugin.getLastVisibleRowIndex());
  },

  onUnselectAll: function(){
    this.lookupReference("selectionGrid").getSelectionModel().deselectAll();
  },

  onRowDblClick: function(grid, record){
    this.getView().lookupReference("logPanel").load(record);
  },

  onRenderStatus: function(value){
    var stateCodeToName = {
      W: "Wait",
      R: "Run",
      S: "Stop",
      F: "Fail",
      D: "Disabled",
    };

    return (stateCodeToName[value]) ? stateCodeToName[value] : value;
  },

  onRenderTooltip: function(value, metaData){
    metaData.tdAttr = 'data-qtip="' + value + '"';

    return value;
  },

  onExport: function(){
    this.save(this.lookupReference("selectionGrid"), "monitor.csv");
  },

  onReload: function(btn){
    if(btn.pressed){
      this.startPolling();
      this.getViewModel().set("icon",
                              this.generateIcon(true, "circle", NOC.colors.yes, __("online")));
    } else{
      this.stopPolling();
      this.getViewModel().set("icon", this.generateIcon(false));
    }
  },

  getEl: function(){
    return this.getView().getEl();
  },

  setContainerDisabled: function(state){
    if(this.destroyed) return;
    var grid = this.lookupReference("grid");
    if(grid){
      grid.getView().setDisabled(state);
    }
    this.getViewModel().set("icon", state ?
      this.generateIcon(true, "stop-circle-o", "grey", __("suspend")) :
      this.generateIcon(true, "circle", NOC.colors.yes, __("online")));
  },

  pollingTask: function(){
    if(this.destroyed) return;
    if(!document.hidden && this.isFocused() && this.isIntersecting){
      this.objectsReload();
    }
  },

  objectsReload: function(){
    var logPanel = this.getView().lookupReference("logPanel"),
      grid = this.getView().lookupReference("grid");
    grid.mask(__("Loading..."));
    this.getViewModel().getStore("objectsStore").load(
      function(){
        grid.unmask();
      },
    );
    if(!logPanel.collapsed){
      logPanel.load();
    }
  },
});
