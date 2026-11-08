//---------------------------------------------------------------------
// inv.inv.plugins.rack RackPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.rack.RackPanel");

Ext.define("NOC.inv.inv.plugins.rack.RackPanel", {
  extend: "NOC.inv.inv.plugins.FileSchemePluginAbstract",
  requires: [
    "NOC.inv.inv.plugins.rack.RackLoadModel",
    "NOC.inv.inv.plugins.rack.RackController",
  ],
  itemId: "rackPanel",
  title: t("app-title-rack"),
  layout: "border",
  scrollable: false,
  controller: "rack",
  initComponent: function(){
    var tbarItems = Ext.clone(this.tbar);
    // ToDo remove after refactoring backend to rack like facade plugin
    this.svgUrlTemplate = new Ext.XTemplate("/inv/inv/{id}/plugin/{name}/{side}.svg");
    // Add Edit button to tbar
    tbarItems.splice(tbarItems.length - 1, 0, {
      text: t("app-title-edit"),
      glyph: NOC.glyph.edit,
      enableToggle: true,
      bind: {
        pressed: "{edit}",
      },
      handler: function(){
        var vm = this.up("panel").getViewModel();
        vm.set("edit", !vm.get("edit"));
      },
    });
    this.tbar = tbarItems;
    // Add grid
    this.items = Ext.apply([], this.items.concat({
      xtype: "grid",
      bind: {
        store: "{gridStore}",
        hidden: "{!edit}",
      },
      region: "east",
      width: 500,
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("header-model"),
          dataIndex: "model",
          width: 200,
        },
        {
          text: t("btn-units"),
          dataIndex: "units",
          width: 50,
        },
        {
          text: t("btn-front"),
          tooltip: t("help-position-front"),
          dataIndex: "position_front",
          width: 50,
          editor: {
            xtype: "numberfield",
            minWidth: 75,
            minValue: 0,
          },
          renderer: function(v){
            if(v === 0){
              return "-";
            } else{
              return v.toString();
            }
          },
        },
        {
          text: t("btn-rear"),
          tooltip: t("help-position-rear"),
          dataIndex: "position_rear",
          width: 50,
          editor: {
            xtype: "numberfield",
            minWidth: 75,
            minValue: 0,
          },
          renderer: function(v){
            if(v === 0){
              return "-";
            } else{
              return v.toString();
            }
          },
        },
        {
          text: t("header-shift"),
          dataIndex: "shift",
          width: 70,
          editor: {
            xtype: "combobox",
            store: [
              [0, "-"],
              [1, "1"],
              [2, "2"],
            ],
          },
          renderer: function(v){
            if(v === 0){
              return "-";
            } else{
              return v.toString();
            }
          },
        },
      ],
      selType: "cellmodel",
      plugins: [
        Ext.create("Ext.grid.plugin.CellEditing", {
          clicksToEdit: 1,
        }),
      ],
      listeners: {
        validateedit: "onCellValidateEdit",
        edit: "onCellEdit",
      },
    }),
    );
    this.getViewModel().setStores({
      gridStore: {
        model: "NOC.inv.inv.plugins.rack.RackLoadModel",
        listeners: {
          datachanged: "onDataChanged",
        },
      },
    });
    this.callParent(arguments);
  },
});
