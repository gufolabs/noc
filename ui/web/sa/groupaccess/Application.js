//---------------------------------------------------------------------
// sa.groupaccess application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.groupaccess.Application");

Ext.define("NOC.sa.groupaccess.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.sa.groupaccess.Model",
    "NOC.aaa.group.LookupField",
    "NOC.sa.administrativedomain.LookupField",
  ],
  model: "NOC.sa.groupaccess.Model",
  columns: [
    {
      text: t("header-group"),
      dataIndex: "group",
      renderer: NOC.render.Lookup("group"),
    },
    {
      text: t("header-adm-domain"),
      dataIndex: "administrative_domain",
      renderer: NOC.render.Lookup("administrative_domain"),
    },
  ],
  fields: [
    {
      name: "group",
      xtype: "aaa.group.LookupField",
      fieldLabel: t("header-group"),
      allowBlank: false,
    },
    {
      name: "administrative_domain",
      xtype: "sa.administrativedomain.LookupField",
      fieldLabel: t("header-adm-domain"),
      allowBlank: true,
    },
  ],
  filters: [
    {
      title: t("app-title-by-group"),
      name: "group",
      ftype: "lookup",
      lookup: "aaa.group",
    },
    {
      title: t("choice-by-administrative-domain"),
      name: "administrative_domain",
      ftype: "lookup",
      lookup: "sa.administrativedomain",
    },
  ],
});
