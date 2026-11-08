//---------------------------------------------------------------------
// main.pyrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.pyrule.Application");

Ext.define("NOC.main.pyrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.CodeViewer",
    "NOC.main.pyrule.Model",
  ],
  model: "NOC.main.pyrule.Model",
  formLayout: {
    type: "vbox",
    align: "stretch",
  },
  search: true,
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-full-name"),
          dataIndex: "full_name",
          flex: 1,
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
        },
        {
          name: "source",
          xtype: "codeviewer",
          fieldLabel: t("header-source"),
          allowBlank: true,
          flex: 1,
          language: "python",
        },
      ],
    });
    me.callParent();
  },
});
