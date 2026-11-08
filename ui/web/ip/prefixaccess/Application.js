//---------------------------------------------------------------------
// ip.prefixaccess application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.prefixaccess.Application");

Ext.define("NOC.ip.prefixaccess.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.ip.prefixaccess.Model",
    "NOC.aaa.user.LookupField",
    "NOC.ip.vrf.LookupField",
  ],
  model: "NOC.ip.prefixaccess.Model",
  search: true,
  columns: [
    {
      text: t("header-user"),
      dataIndex: "user",
      renderer: NOC.render.Lookup("user"),
    },
    {
      text: t("header-vrf"),
      dataIndex: "vrf",
      renderer: NOC.render.Lookup("vrf"),
    },
    {
      text: t("header-afi"),
      dataIndex: "afi",
      renderer: function(v){ return "IPv" + v; },
    },
    {
      text: t("header-prefix"),
      dataIndex: "prefix",
    },
    {
      text: t("btn-view"),
      dataIndex: "can_view",
      renderer: NOC.render.Bool,
      width: 50,
    },
    {
      text: t("header-change"),
      dataIndex: "can_change",
      renderer: NOC.render.Bool,
      width: 50,
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
      name: "vrf",
      xtype: "ip.vrf.LookupField",
      fieldLabel: t("header-vrf"),
      allowBlank: false,
    },
    {
      name: "afi",
      xtype: "combobox",
      fieldLabel: t("label-address-family"),
      allowBlank: false,
      queryMode: "local",
      displayField: "label",
      valueField: "id",
      store: {
        fields: ["id", "label"],
        data: [
          {id: "4", label: "IPv4"},
          {id: "6", label: "IPv6"},
        ],
      },
    },
    {
      name: "prefix",
      xtype: "textfield",
      fieldLabel: t("header-prefix"),
      allowBlank: false,
    },
    {
      name: "can_view",
      xtype: "checkboxfield",
      boxLabel: t("label-can-view"),
      allowBlank: false,
    },
    {
      name: "can_change",
      xtype: "checkboxfield",
      boxLabel: t("label-can-change"),
      allowBlank: false,
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
      title: t("app-title-by-vrf"),
      name: "vrf",
      ftype: "lookup",
      lookup: "ip.vrf",
    },
    {
      title: t("app-title-by-afi"),
      name: "afi",
      ftype: "afi",
    },
    {
      title: t("app-title-by-can-view"),
      name: "can_view",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-can-change"),
      name: "can_change",
      ftype: "boolean",
    },
  ],
});
