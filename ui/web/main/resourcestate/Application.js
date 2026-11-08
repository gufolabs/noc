//---------------------------------------------------------------------
// main.resourcestate application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.resourcestate.Application");

Ext.define("NOC.main.resourcestate.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.resourcestate.Model",
    "NOC.main.resourcestate.LookupField",
  ],
  model: "NOC.main.resourcestate.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
      width: 70,
    },
    {
      text: t("header-starting"),
      dataIndex: "is_starting",
      renderer: NOC.render.Bool,
      width: 70,
    },
    {
      text: t("header-default"),
      dataIndex: "is_default",
      renderer: NOC.render.Bool,
      width: 70,
    },
    {
      text: t("header-provisioned"),
      dataIndex: "is_provisioned",
      renderer: NOC.render.Bool,
      width: 70,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
    {
      text: t("header-step-to"),
      dataIndex: "step_to",
      renderer: NOC.render.Lookup("step_to"),
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
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
      anchor: "100%",
    },
    {
      name: "is_active",
      xtype: "checkboxfield",
      boxLabel: t("header-active"),
      allowBlank: false,
    },
    {
      name: "is_starting",
      xtype: "checkboxfield",
      boxLabel: t("header-starting"),
      allowBlank: false,
    },
    {
      name: "is_default",
      xtype: "checkboxfield",
      boxLabel: t("header-default"),
      allowBlank: false,
    },
    {
      name: "is_provisioned",
      xtype: "checkboxfield",
      boxLabel: t("header-provisioned"),
      allowBlank: false,
    },
    {
      name: "step_to",
      xtype: "main.resourcestate.LookupField",
      fieldLabel: t("header-step-to"),
      allowBlank: true,
    },
  ],
});
