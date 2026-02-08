//---------------------------------------------------------------------
// main.desktop.report application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.desktop.ReportColSelect");

Ext.define("NOC.main.desktop.ReportColSelect", {
  extend: "Ext.grid.Panel",
  alias: "widget.reportcolumnselect",
  mixins: {
    field: "Ext.form.field.Field",
  },
  columns: [
    {
      text: __("Active"),
      dataIndex: "is_active",
      width: 70,
      renderer: NOC.render.Bool,
    },
    {
      text: __("Field"),
      dataIndex: "label",
      flex: 1,
    },
  ],
  listeners: {
    rowdblclick: "toggle",
  },
  getValue: function(){
    var selectedFields = Ext.Array.filter(this.getStore().getData().items, function(field){return field.get("is_active");});

    return Ext.Array.map(selectedFields, function(field){return field.id;}).join(",");
  },
  toggle: function(self, record){
    record.set("is_active", !record.get("is_active"));
  },
});