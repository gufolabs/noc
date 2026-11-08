//---------------------------------------------------------------------
// fm.ignoreeventrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.ignoreeventrule.Application");

Ext.define("NOC.fm.ignoreeventrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.fm.ignoreeventrule.Model"],
  model: "NOC.fm.ignoreeventrule.Model",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-left-re"),
      dataIndex: "left_re",
      flex: 1,
    },
    {
      text: t("header-right-re"),
      dataIndex: "right_re",
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
      name: "left_re",
      xtype: "textfield",
      fieldLabel: t("header-left-re"),
      allowBlank: false,
    },
    {
      name: "right_re",
      xtype: "textfield",
      fieldLabel: t("label-right-re"),
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
  ],
  filters: [
    {
      title: t("app-title-by-is-active"),
      name: "is_active",
      ftype: "boolean",
    },
  ],
});
