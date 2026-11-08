//---------------------------------------------------------------------
// ip.addressrange application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.addressrange.Application");

Ext.define("NOC.ip.addressrange.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.ip.addressrange.Model",
    "NOC.ip.vrf.LookupField",
  ],
  model: "NOC.ip.addressrange.Model",
  search: true,
  rowClassField: "row_class",
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      flex: 1,
    },
    {
      dataIndex: "is_active",
      text: t("header-active-2"),
      renderer: NOC.render.Bool,
      width: 50,
    },
    {
      text: t("header-vrf"),
      dataIndex: "vrf",
      renderer: NOC.render.Lookup("vrf"),
    },
    {
      text: t("header-afi"),
      dataIndex: "afi",
      width: 40,
      renderer: function(v){
        return "IPv" + v;
      },
    },
    {
      text: t("header-from-address"),
      dataIndex: "from_address",
      width: 80,
    },
    {
      text: t("header-to-address"),
      dataIndex: "to_address",
      width: 80,
    },
    {
      dataIndex: "is_locked",
      text: t("header-locked"),
      renderer: NOC.render.Bool,
      width: 50,
    },
    {
      text: t("app-title-action"),
      dataIndex: "action",
      renderer: function(a){
        return {N: "Do nothing", G: "Generate FQDNs", D: "Partial reverse zone delegation"}[a];
      },
    },
    {
      text: t("label-description"),
      dataIndex: "description",
    },
    {
      text: t("header-labels"),
      dataIndex: "labels",
      renderer: NOC.render.LabelField,
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
      store: [["4", "IPv4"], ["6", "IPv6"]],
      uiStyle: "small",
    },
    {
      name: "from_address",
      xtype: "textfield",
      fieldLabel: t("header-from-address"),
      allowBlank: false,
      uiStyle: "medium",
    },
    {
      name: "to_address",
      xtype: "textfield",
      fieldLabel: t("header-to-address"),
      allowBlank: false,
      uiStyle: "medium",
    },
    {
      name: "description",
      xtype: "textareafield",
      fieldLabel: t("label-description"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "is_locked",
      xtype: "checkboxfield",
      boxLabel: t("label-is-locked"),
    },
    {
      name: "action",
      xtype: "combobox",
      fieldLabel: t("app-title-action"),
      allowBlank: false,
      store: [
        ["N", "Do nothing"],
        ["G", "Generate FQDNs"],
        ["D", "Partial reverse zone delegation"],
      ],
      uiStyle: "medium",
    },
    {
      name: "fqdn_template",
      xtype: "textfield",
      allowBlank: true,
      fieldLabel: t("label-fqdn-template"),
    },
    {
      name: "reverse_nses",
      xtype: "textfield",
      allowBlank: true,
      fieldLabel: t("label-reverse-nses"),
    },
    {
      name: "labels",
      xtype: "labelfield",
      fieldLabel: t("header-labels"),
      allowBlank: true,
      query: {
        "enable_ipaddressrange": true,
      },
    },
    {
      name: "tt",
      xtype: "textfield",
      regexText: /^\d*$/,
      fieldLabel: t("label-tt"),
      allowBlank: true,
    },
    {
      name: "allocated_till",
      xtype: "datefield",
      startDay: 1,
      fieldLabel: t("label-allocated-till"),
      allowBlank: true,
    },
  ],
  filters: [
    {
      title: t("app-title-by-is-active"),
      name: "is_active",
      ftype: "boolean",
    },
    {  
      title: t("app-title-by-vrf"),
      name: "vrf",   
      ftype: "lookup",
      lookup: "ip.vrf",
    },
    {  
      title: t("app-title-by-is-locked"),
      name: "is_locked",   
      ftype: "boolean",
    },
  ],
  showOpError: function(action, op, status){
    var me = this;
    // Detect Syntax Errors
    if(status.traceback){
      NOC.error(status.traceback);
      return;
    }
    me.callParent([action, op, status]);
  },
});
