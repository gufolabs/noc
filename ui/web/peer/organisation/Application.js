//---------------------------------------------------------------------
// peer.organisation application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.organisation.Application");

Ext.define("NOC.peer.organisation.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.peer.organisation.Model",
    "NOC.peer.maintainer.LookupField",
  ],
  model: "NOC.peer.organisation.Model",
  search: true,
  columns: [
    {
      text: t("label-organisation"),
      dataIndex: "organisation",
      flex: 1,
    },

    {
      text: t("header-org-name"),
      dataIndex: "org_name",
      flex: 1,
    },
    {
      text: t("header-org-type"),
      dataIndex: "org_type",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "organisation",
      xtype: "textfield",
      fieldLabel: t("label-organisation"),
      allowBlank: false,
      width: 300,
    },
    {
      name: "org_name",
      xtype: "textfield",
      fieldLabel: t("header-org-name"),
      allowBlank: false,
      width: 300,
    },
    {
      name: "org_type",
      xtype: "combobox",
      fieldLabel: t("header-org-type"),
      allowBlank: false,
      store: ["IANA", "RIR", "NIR", "LIR", "OTHER"],
    },
    {
      name: "address",
      xtype: "textareafield",
      fieldLabel: t("app-title-address"),
      allowBlank: false,
      anchor: "70%",
    },
    {
      name: "mnt_ref",
      xtype: "peer.maintainer.LookupField",
      fieldLabel: t("label-mnt-ref"),
      allowBlank: false,
    },
  ],
  filters: [
  ],
});
