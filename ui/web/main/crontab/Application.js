//---------------------------------------------------------------------
// main.crontab application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.crontab.Application");

Ext.define("NOC.main.crontab.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.crontab.Model",
  ],
  model: "NOC.main.crontab.Model",
  search: true,

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 25,
          renderer: NOC.render.Bool,
        },
        {
          text: t("app-title-crontab"),
          dataIndex: "crontab_expression",
          width: 200,
        },
        {
          text: t("app-title-handler"),
          dataIndex: "handler",
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
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "handler",
          xtype: "textfield",
          fieldLabel: t("app-title-handler"),
          allowBlank: false,
          uiStyle: "medium",
          // vtype: "handler"
        },
        {
          name: "seconds_expr",
          xtype: "textfield",
          fieldLabel: t("label-seconds-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "0",
        },
        {
          name: "minutes_expr",
          xtype: "textfield",
          fieldLabel: t("label-minutes-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "*",
        },
        {
          name: "hours_expr",
          xtype: "textfield",
          fieldLabel: t("label-hours-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "*",
        },
        {
          name: "days_expr",
          xtype: "textfield",
          fieldLabel: t("label-days-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "*",
        },
        {
          name: "months_expr",
          xtype: "textfield",
          fieldLabel: t("label-months-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "*",
        },
        {
          name: "weekdays_expr",
          xtype: "textfield",
          fieldLabel: t("label-weekdays-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "*",
        },
        {
          name: "years_expr",
          xtype: "textfield",
          fieldLabel: t("label-years-expr"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: "*",
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
