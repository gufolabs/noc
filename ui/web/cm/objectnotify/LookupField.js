//---------------------------------------------------------------------
// NOC.cm.objectnotify.Lookup
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.cm.objectnotify.LookupField");

Ext.define("NOC.cm.objectnotify.LookupField", {
  extend: "Ext.form.field.ComboBox",
  alias: "widget.cm.objectnotify.LookupField",
  queryMode: "local",
  valueField: "value",
  editable: false,
  store: {
    fields: ["value", "text"],
    data: [
      {"value": "dns", "text": t("app-group-dns")},
      {"value": "prefix-list", "text": t("label-prefix-list")},
      {"value": "rpsl", "text": t("label-rpsl")},
    ],
  },
});
