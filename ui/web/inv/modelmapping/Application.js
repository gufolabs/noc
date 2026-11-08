//---------------------------------------------------------------------
// inv.modelmapping application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.modelmapping.Application");

Ext.define("NOC.inv.modelmapping.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.modelmapping.Model",
    "NOC.inv.objectmodel.LookupField",
  ],
  model: "NOC.inv.modelmapping.Model",
  columns: [
    {
      text: t("header-vendor"),
      dataIndex: "vendor",
      width: 100,
    },
    {
      text: t("header-part-no"),
      dataIndex: "part_no",
      width: 75,
    },
    {
      text: t("header-from-serial"),
      dataIndex: "from_serial",
      width: 75,
    },
    {
      text: t("header-to-serial"),
      dataIndex: "to_serial",
      width: 75,
    },
    {
      text: t("header-model"),
      dataIndex: "model",
      renderer: NOC.render.Lookup("model"),
      width: 200,
    },
    {
      text: t("header-active"),
      dataIndex: "is_active",
      renderer: NOC.render.Bool,
      width: 50,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "vendor",
      xtype: "textfield",
      fieldLabel: t("header-vendor"),
      allowBlank: false,
    },
    {
      name: "part_no",
      xtype: "textfield",
      fieldLabel: t("header-part-no"),
      allowBlank: true,
    },
    {
      name: "from_serial",
      xtype: "textfield",
      fieldLabel: t("label-from-serial"),
      allowBlank: true,
    },
    {
      name: "to_serial",
      xtype: "textfield",
      fieldLabel: t("label-to-serial"),
      allowBlank: true,
    },
    {
      name: "model",
      xtype: "inv.objectmodel.LookupField",
      fieldLabel: t("header-model"),
      uiStyle: "large",
      allowBlank: false,
    },
    {
      name: "is_active",
      xtype: "checkboxfield",
      boxLabel: t("header-active"),
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
  ],
});
