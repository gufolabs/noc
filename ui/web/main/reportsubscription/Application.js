//---------------------------------------------------------------------
// main.reportsubscription application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.reportsubscription.Application");

Ext.define("NOC.main.reportsubscription.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.reportsubscription.Model",
    "NOC.main.notificationgroup.LookupField",
    "NOC.aaa.user.LookupField",
    "NOC.main.ref.report.LookupField",
  ],
  model: "NOC.main.reportsubscription.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-file-name"),
          dataIndex: "file_name",
          width: 100,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 25,
          renderer: NOC.render.Bool,
        },
        {
          text: t("msg-report"),
          dataIndex: "report",
          width: 250,
          renderer: NOC.render.Lookup("report"),
        },
        {
          text: t("app-title-notificationgroup"),
          dataIndex: "notification_group",
          flex: 1,
          renderer: NOC.render.Lookup("notification_group"),
        },
      ],

      fields: [
        {
          name: "file_name",
          xtype: "textfield",
          fieldLabel: t("header-file-name"),
          allowBlank: false,
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-is-active"),
        },
        {
          name: "run_as",
          xtype: "aaa.user.LookupField",
          fieldLabel: t("label-run-as"),
          allowBlank: false,
        },
        {
          name: "report",
          xtype: "main.ref.report.LookupField",
          fieldLabel: t("msg-report"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "subject",
          xtype: "textfield",
          fieldLabel: t("header-subject"),
          allowBlank: true,
        },
        {
          name: "notification_group",
          xtype: "main.notificationgroup.LookupField",
          fieldLabel: t("app-title-notificationgroup"),
          uiStyle: "medium",
          allowBlank: true,
        },
      ],
    });
    me.callParent();
  },
});
