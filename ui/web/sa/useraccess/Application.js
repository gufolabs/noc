//---------------------------------------------------------------------
// sa.useraccess application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.useraccess.Application");

Ext.define("NOC.sa.useraccess.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.sa.useraccess.Model",
    "NOC.aaa.user.LookupField",
    "NOC.sa.administrativedomain.LookupField",
  ],
  model: "NOC.sa.useraccess.Model",
  columns: [
    {
      text: t("header-user"),
      dataIndex: "user",
      renderer: NOC.render.Lookup("user"),
    },
    {
      text: t("header-adm-domain"),
      dataIndex: "administrative_domain",
      renderer: NOC.render.Lookup("administrative_domain"),
    },
  ],
  fields: [
    {
      name: "user",
      xtype: "aaa.user.LookupField",
      fieldLabel: t("header-user"),
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
      title: t("app-title-by-user"),
      name: "user",
      ftype: "lookup",
      lookup: "aaa.user",
    },
    {
      title: t("choice-by-administrative-domain"),
      name: "administrative_domain",
      ftype: "lookup",
      lookup: "sa.administrativedomain",
    },
  ],
});
