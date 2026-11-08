//---------------------------------------------------------------------
// main.language application
//---------------------------------------------------------------------
// Copyright (C) 2007-2011 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.language.Application");

Ext.define("NOC.main.language.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.main.language.Model"],
    
  model: "NOC.main.language.Model",
  search: true,
    
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-native-name"),
      dataIndex: "native_name",
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
    },
  ],
    
  fields: [
    {
      xtype: "textfield",
      fieldLabel: t("header-name"),
      name: "name",
      allowBlank: false,
    },

    {
      xtype: "textfield",
      fieldLabel: t("header-native-name"),
      name: "native_name",
      allowBlank: false,
    },
        
    {
      xtype: "checkboxfield",
      boxLabel: t("header-is-active"),
      name: "is_active",
      inputValue: true,
    },
  ],

  filters: [
    {
      title: t("app-title-by-is-active"),
      ftype: "boolean",
      name: "is_active",
    },
  ],
});
