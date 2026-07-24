//---------------------------------------------------------------------
// NOC.main.soform.Lookup
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.soform.LookupField");

Ext.define("NOC.main.ref.soform.LookupField", {
  extend: "Ext.form.field.ComboBox",
  alias: "widget.main.ref.soform.LookupField",
  uiStyle: "medium-combo",
  askPermission: false,
  queryMode: "local",
  forceSelection: true,
  editable: false,
  valueField: "id",
  displayField: "name",
  store: {
    fields: ["id", "name", "icon"],
    data: [
      {id: "c", name: __("Circle"), icon: "fa-circle"},
      {id: "s", name: __("Square"), icon: "fa-square"},
    ],
  },
  tpl: '<tpl for="."><div class="x-boundlist-item"><i class="fa {[values.icon]}"></i>&nbsp; {[values.name]}</div></tpl>',
});
