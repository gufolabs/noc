//---------------------------------------------------------------------
// peer.rir application
//---------------------------------------------------------------------
// Copyright (C) 2007-2011 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.rir.Application");

Ext.define("NOC.peer.rir.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.peer.rir.Model"],
  model: "NOC.peer.rir.Model",
  columns: [
    {
      text: t("app-title-rir"),
      dataIndex: "name",
    },
        
    {
      text: t("header-whois"),
      dataIndex: "whois",
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name-2"),
      allowBlank: false,
      uiStyle: "medium",
    },
    {
      name: "whois",
      xtype: "textfield",
      fieldLabel: t("header-whois"),
      allowBlank: true,
    },
  ],
});
