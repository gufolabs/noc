//---------------------------------------------------------------------
// inv.inv OPM Panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.opm.OPMPanel");

Ext.define("NOC.inv.inv.plugins.opm.OPMPanel", {
  extend: "Ext.panel.Panel",
  requires: [
    "NOC.inv.inv.plugins.opm.OPMController",
    "NOC.inv.inv.plugins.opm.OPMDiagram",
    "NOC.inv.inv.plugins.opm.OPMRightPanel",
  ],
  title: t("app-title-opm"),
  closable: false,
  controller: "opm",
  layout: "border",
  scrollable: false, 
  viewModel: {
    stores: {
      groupsStore: {
        data: [],
      },
      bandsStore: {
        data: [],
      },
    },
    data: {
      isGroupsEmpty: true,
      isBandsEmpty: true,   
      group: undefined,
      band: undefined,
      currentId: undefined,
      icon: "<i class='fa fa-fw' style='padding-left:4px;width:16px;'></i>",
    },  
  },
  tbar: [
    {
      xtype: "combobox",
      fieldLabel: t("app-title-group"),
      emptyText: t("label-select-group"),
      valueField: "value",
      displayField: "value",  
      bind: {
        store: "{groupsStore}",
        disabled: "{isGroupsEmpty}",
        value: "{group}",
      },
      editable: false,
      queryMode: "local",
      listeners: {
        select: "onComboboxSelect",
      },
    },
    {
      xtype: "combobox",
      fieldLabel: t("label-bands"),
      emptyText: t("label-select-band"),
      valueField: "value",
      displayField: "value",  
      bind: {
        store: "{bandsStore}",
        disabled: "{isBandsEmpty}",
        value: "{band}",
      },
      editable: false,
      queryMode: "local",
      listeners: {
        select: "onComboboxSelect", 
      },
    },
    "->",
    {
      glyph: NOC.glyph.cog,
      tooltip: t("help-settings"),
      style: {
        pointerEvents: "all",
      },
      handler: "collapseSettings",
    },
    {
      xtype: "tbtext",
      width: 32,
      height: 32,
      padding: "8 0 0 4",
      bind: {
        html: "{icon}",
      },
      updateLayout: Ext.emptyFn,
    },
  ],
  items: [
    {
      xtype: "panel",
      region: "center",
      layout: "absolute",
      border: false,
      scrollable: "x",
      items: [
        {
          xtype: "opm.diagram",
          reference: "opmDiagram",
          region: "center",
        },
      ],
    },
    {
      xtype: "opm.rightPanel",
      reference: "opmRightPanel",
      region: "east",
      width: "20%",
      split: true,
      collapsed: true,
      hideCollapseTool: true,
      animCollapse: false,
      collapseMode: "mini",
    },
  ],
  preview: function(data, id){
    var vm = this.getViewModel(),
      bandsStore = vm.getStore("bandsStore"),
      groupsStore = vm.getStore("groupsStore");
      
    bandsStore.loadData(this.mapData(data.bands));
    groupsStore.loadData(this.mapData(data.groups));
    vm.set("isGroupsEmpty", groupsStore.getCount() === 0);
    vm.set("isBandsEmpty", bandsStore.getCount() === 0);
    vm.set("currentId", id);
    vm.set("group", groupsStore.getCount() > 0 ? groupsStore.getAt(0).get("value") : undefined);
    vm.set("band", bandsStore.getCount() > 0 ? bandsStore.getAt(0).get("value") : undefined);
    this.getController().startTimer();
  },
  onDestroy: function(){
    if(this.timer){
      Ext.TaskManager.stop(this.timer);
    }
    this.callParent();
  },
  mapData: function(array){
    if(!array){
      return [];
    }
    return Ext.Array.map(array, function(item){
      return {value: item};
    });
  },
});