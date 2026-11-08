//---------------------------------------------------------------------
// peer.communitytype application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.communitytype.Application");

Ext.define("NOC.peer.communitytype.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.peer.communitytype.Model"],
  model: "NOC.peer.communitytype.Model",
  search: true,
  columns: [
    {
      text: t("label-description"),
      dataIndex: "name",
      flex: 1,
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      width: 400,
      allowBlank: false,
    },
  ],
});
