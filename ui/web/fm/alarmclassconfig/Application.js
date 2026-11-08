//---------------------------------------------------------------------
// fm.alarmclassconfig application
//---------------------------------------------------------------------
// Copyright (C) 2007-2014 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmclassconfig.Application");

Ext.define("NOC.fm.alarmclassconfig.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.alarmclassconfig.Model",
    "NOC.fm.alarmclass.LookupField",
  ],
  model: "NOC.fm.alarmclassconfig.Model",
  columns: [
    {
      text: t("app-title-alarmclass"),
      dataIndex: "alarm_class",
      renderer: NOC.render.Lookup("alarm_class"),
      width: 200,
    },
    {
      text: t("header-notification-delay"),
      dataIndex: "notification_delay",
      width: 100,
      align: "right",
    },
    {
      text: t("header-control-time-0"),
      dataIndex: "control_time0",
      width: 100,
      align: "right",
    },
    {
      text: t("header-control-time-1"),
      dataIndex: "control_time1",
      width: 100,
      align: "right",
    },
    {
      text: t("header-control-time-n"),
      dataIndex: "control_timeN",
      width: 100,
      align: "right",
    },
  ],
  fields: [
    {
      name: "alarm_class",
      xtype: "fm.alarmclass.LookupField",
      fieldLabel: t("app-title-alarmclass"),
      allowBlank: false,
    },
    {
      name: "notification_delay",
      xtype: "numberfield",
      fieldLabel: t("label-notification-delay-s"),
      allowBlank: true,
      minValue: 0,
    },
    {
      name: "control_time0",
      xtype: "numberfield",
      fieldLabel: t("label-control-time-no-reopens"),
      allowBlank: true,
      minValue: 0,
    },
    {
      name: "control_time1",
      xtype: "numberfield",
      fieldLabel: t("label-control-time-1-reopen"),
      allowBlank: true,
      minValue: 0,
    },
    {
      name: "control_timeN",
      xtype: "numberfield",
      fieldLabel: t("label-control-time-multiple-reopens"),
      allowBlank: true,
      minValue: 0,
    },
  ],
});
