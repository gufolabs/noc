//---------------------------------------------------------------------
// main.sync application
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.sync.Application");

Ext.define("NOC.main.sync.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.sync.Model",
    "NOC.aaa.user.LookupField",
  ],
  model: "NOC.main.sync.Model",
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
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("header-instances"),
          dataIndex: "n_instances",
          width: 70,
          align: "right",
        },
        {
          text: t("header-credentials"),
          dataIndex: "user",
          width: 100,
          renderer: NOC.render.Lookup("user"),
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          allowBlank: false,
          fieldLabel: t("header-name"),
          regex: /^[a-z0-9.\-_]+$/i,
        },
        {
          name: "is_active",
          xtype: "checkboxfield",
          boxLabel: t("header-active"),
        },
        {
          name: "user",
          xtype: "aaa.user.LookupField",
          fieldLabel: t("header-credentials"),
        },
        {
          name: "n_instances",
          xtype: "numberfield",
          fieldLabel: t("header-instances"),
          minValue: 1,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
      ],
      filters: [
        {
          title: t("header-active"),
          name: "is_active",
          ftype: "boolean",
        },
      ],
    });
    me.callParent();
  },
});
