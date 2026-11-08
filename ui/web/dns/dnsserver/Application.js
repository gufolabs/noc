//---------------------------------------------------------------------
// dns.dnsserver application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.dns.dnsserver.Application");

Ext.define("NOC.dns.dnsserver.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.dns.dnsserver.Model",
    "NOC.main.sync.LookupField",
  ],
  model: "NOC.dns.dnsserver.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 100,
    },
    {
      text: t("header-ip"),
      dataIndex: "ip",
      width: 100,
    },
    {
      text: t("label-description"),
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
      name: "ip",
      xtype: "textfield",
      fieldLabel: t("header-ip"),
      allowBlank: true,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
  ],
});
