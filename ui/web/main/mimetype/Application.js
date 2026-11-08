//---------------------------------------------------------------------
// main.mimetype application
//---------------------------------------------------------------------
// Copyright (C) 2007-2011 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.mimetype.Application");

Ext.define("NOC.main.mimetype.Application", {
  extend: "NOC.core.ModelApplication",
  requires: ["NOC.main.mimetype.Model"],
    
  model: "NOC.main.mimetype.Model",
    
  columns: [
    {
      text: t("header-extension"),
      dataIndex: "extension",
    },
    {
      text: t("header-mime-type"),
      dataIndex: "mime_type",
      flex: 1,
    },
  ],
    
  fields: [
    {
      xtype: "textfield",
      fieldLabel: t("header-extension"),
      name: "extension",
      allowBlank: false,
      regex: /^\.[a-zA-Z0-9-]+$/,
    },

    {
      xtype: "textfield",
      fieldLabel: t("header-mime-type"),
      name: "mime_type",
      allowBlank: false,
      width: 500,
      regex: /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/,
    },
  ],
});
