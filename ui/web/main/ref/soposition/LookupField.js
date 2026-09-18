//---------------------------------------------------------------------
// NOC.main.soposition.Lookup
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.soposition.LookupField");

Ext.define("NOC.main.ref.soposition.LookupField", {
  extend: "Ext.form.field.ComboBox",
  alias: "widget.main.ref.soposition.LookupField",
  uiStyle: "medium-combo",
  askPermission: false,
  queryMode: "local",
  forceSelection: true,
  editable: false,
  valueField: "id",
  displayField: "name",
  store: {
    fields: ["id", "name"],
    data: [
      {id: "NW", name: "NW", icon: "arrow-nw-s"},
      {id: "N", name: "N", icon: "arrow-up-s"},
      {id: "NE", name: "NE", icon: "arrow-ne-s"},
      {id: "E", name: "E", icon: "arrow-right-s"},
      {id: "SE", name: "SE", icon: "arrow-se-s"},
      {id: "S", name: "S", icon: "arrow-down-s"},
      {id: "SW", name: "SW", icon: "arrow-sw-s"},
      {id: "W", name: "W", icon: "arrow-left-s"},
    ],
  },
  tpl: '<tpl for="."><div class="x-boundlist-item"><i class="gf {[values.icon]}"></i>&nbsp; {[values.name]}</div></tpl>',
});
