//---------------------------------------------------------------------
// main.customfieldenumgroup application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.customfieldenumgroup.Application");

Ext.define("NOC.main.customfieldenumgroup.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.customfieldenumgroup.Model",
  ],
  model: "NOC.main.customfieldenumgroup.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 200,
    },
    {
      text: t("header-act"),
      dataIndex: "is_active",
      width: 30,
      renderer: NOC.render.Bool,
    },
    {
      name: "Description",
      dataIndex: "description",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name"),
      allowBlank: false,
    },
    {
      name: "is_active",
      xtype: "checkboxfield",
      boxLabel: t("header-is-active"),
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
  ],
  filters: [{
    title: t("app-title-is-active"),
    name: "is_active",
    ftype: "boolean",
  }],
  inlines: [{
    title: "Values",
    model: "NOC.main.customfieldenumgroup.ValuesModel",
    columns: [
      {
        text: t("header-act"),
        dataIndex: "is_active",
        renderer: NOC.render.Bool,
        width: 30,
        editor: "checkbox",
      },
      {
        text: t("header-key"),
        dataIndex: "key",
        width: 150,
        editor: {
          xtype: "textfield",
          allowBlank: false,
        },
      },
      {
        text: t("header-value"),
        dataIndex: "value",
        flex: 1,
        editor: {
          xtype: "textfield",
          allowBlank: false,
        },
      },
    ],
  }],
});
