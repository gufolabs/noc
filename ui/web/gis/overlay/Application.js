//---------------------------------------------------------------------
// gis.overlay application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.gis.overlay.Application");

Ext.define("NOC.gis.overlay.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.gis.overlay.Model"],
  model: "NOC.gis.overlay.Model",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-gate-id"),
      dataIndex: "gate_id",
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
    },
    {
      text: t("header-plugin"),
      dataIndex: "plugin",
    },
    {
      text: t("header-permission"),
      dataIndex: "permission_name",
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
      name: "gate_id",
      xtype: "textfield",
      fieldLabel: t("header-gate-id"),
      allowBlank: false,
      regex: /^[a-zA-Z0-9_-]+$/,
    },
    {
      name: "Active",
      xtype: "checkboxfield",
      boxLabel: t("label-is-active"),
    },
    {
      name: "Plugin",
      xtype: "textfield",
      fieldLabel: t("label-plugin"),
      allowBlank: false,
    },
    {
      name: "Permission",
      xtype: "textfield",
      fieldLabel: t("label-permission-name"),
      allowBlank: false,
    },
  ],
});
