//---------------------------------------------------------------------
// main.chpolicy application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.chpolicy.Application");

Ext.define("NOC.main.chpolicy.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.chpolicy.Model",
  ],
  model: "NOC.main.chpolicy.Model",
  search: true,
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-table"),
          dataIndex: "table",
          width: 200,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 25,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-ttl"),
          dataIndex: "ttl",
          width: 100,
          renderer: function(v){
            if(v && v > 0){
              return v
            }
            return t("msg-disabled")
          },
        },
        {
          text: t("header-rows"),
          dataIndex: "rows",
          width: 100,
          renderer: NOC.render.Size,
          align: "right",
        },
        {
          text: t("header-size"),
          dataIndex: "size",
          width: 100,
          renderer: NOC.render.Size,
          align: "right",
        },
      ],
      fields: [
        {
          name: "table",
          xtype: "textfield",
          fieldLabel: t("header-table"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "ttl",
          xtype: "numberfield",
          fieldLabel: t("label-ttl-days"),
          allowBlank: false,
          minValue: 0,
          uiStyle: "small",
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-active"),
      name: "is_active",
      ftype: "boolean",
    },
  ],
});
