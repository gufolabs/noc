//---------------------------------------------------------------------
// peer.person application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.person.Application");

Ext.define("NOC.peer.person.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.MonacoPanel",
    "NOC.peer.person.Model",
    "NOC.peer.rir.LookupField",
  ],
  model: "NOC.peer.person.Model",
  search: true,
  columns: [
    {
      text: t("header-nic-hdl"),
      dataIndex: "nic_hdl",
      flex: 1,
    },
    {
      text: t("header-person-role-name"),
      dataIndex: "person",
      flex: 1,
    },
    {
      text: t("header-type"),
      dataIndex: "type",
      renderer: function(a){
        return {P: "Person", R: "Role"}[a];
      },
      flex: 1,
    },
    {
      text: t("app-title-rir"),
      dataIndex: "rir",
      renderer: NOC.render.Lookup("rir"),
      flex: 1,
    },
  ],
  fields: [
    {
      name: "nic_hdl",
      xtype: "textfield",
      fieldLabel: t("header-nic-hdl"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "type",
      xtype: "combobox",
      fieldLabel: t("header-type"),
      allowBlank: false,
      store: [
        ["P", "Person"],
        ["R", "Role"],     
      ],
    },
    {
      name: "person",
      xtype: "textfield",
      fieldLabel: t("header-person-role-name"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "address",
      xtype: "textareafield",
      fieldLabel: t("app-title-address"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "phone",
      xtype: "textareafield",
      fieldLabel: t("app-group-phone"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "fax_no",
      xtype: "textareafield",
      fieldLabel: t("label-fax-no"),
      anchor: "70%",
    },
    {
      name: "email",
      xtype: "textareafield",
      fieldLabel: t("label-email"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "rir",
      xtype: "peer.rir.LookupField",
      fieldLabel: t("app-title-rir"),
      allowBlank: false,
    },
    {
      name: "extra",
      xtype: "textareafield",
      fieldLabel: t("label-extra"),
      anchor: "70%",
    },
  ],
  filters: [
    {
      title: "By RIR",
      name: "rir",
      ftype: "lookup",
      lookup: "peer.rir",
    },
  ],
  preview: {
    xtype: "NOC.core.MonacoPanel",
    syntax: "rpsl",
    // ToDo need check nic_hdl variable in previewName
    previewName: "Person RPSL: {0}",
    restUrl: "/peer/person/{0}/repo/rpsl/",
  },
});
