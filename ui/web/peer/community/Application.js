//---------------------------------------------------------------------
// peer.community application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.community.Application");

Ext.define("NOC.peer.community.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.peer.community.Model",
             "NOC.peer.communitytype.LookupField",
  ],
  model: "NOC.peer.community.Model",
  search: true,
  columns: [
    {
      text: t("title-community"),
      dataIndex: "community",
      flex: 1,
    },
    {
      text: t("header-type"),
      dataIndex: "type",
      renderer: NOC.render.Lookup("type"),
      flex: 1,
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "community",
      xtype: "textfield",
      fieldLabel: t("title-community"),
      width: 400,
      allowBlank: false,
    },
    {
      name: "type",
      xtype: "peer.communitytype.LookupField",
      fieldLabel: t("header-type"),
      width: 400,
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      width: 400,
      allowBlank: false,
    }, 
  ],
  filters: [
    {
      title: t("app-title-by-community-type"),
      name: "type",
      ftype: "lookup",
      lookup: "peer.communitytype",
    },
  ],
});
