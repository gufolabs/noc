//---------------------------------------------------------------------
// peer.peergroup application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.peergroup.Application");

Ext.define("NOC.peer.peergroup.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.peer.peergroup.Model",
  ],
  model: "NOC.peer.peergroup.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      flex: 1,
    },

    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
    {
      text: t("header-import-communities"),
      dataIndex: "communities",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name"),
      allowBlank: false,
      width: 300,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: false,
      width: 300,
    },
    {
      name: "communities",
      xtype: "textfield",
      fieldLabel: t("header-import-communities"),
      allowBlank: true,
      width: 300,
    },
    {
      name: "max_prefixes",
      xtype: "textfield",
      maskRe: /\d/i,
      fieldLabel: t("label-max-prefixes"),
      allowBlank: false,
    },
    {
      name: "local_pref",
      xtype: "textfield",
      maskRe: /\d/i,
      fieldLabel: t("label-local-pref"),
      allowBlank: true,
    },
    {
      name: "import_med",
      xtype: "textfield",
      maskRe: /\d/i,
      fieldLabel: t("label-import-med"),
      allowBlank: true,
    },
    {
      name: "export_med",
      xtype: "textfield",
      maskRe: /\d/i,
      fieldLabel: t("label-export-med"),
      allowBlank: true,
    },
  ],
  filters: [
  ],
});
