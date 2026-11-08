//---------------------------------------------------------------------
// fm.alarmtrigger application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmtrigger.Application");

Ext.define("NOC.fm.alarmtrigger.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.alarmtrigger.Model",
    "NOC.main.timepattern.LookupField",
    "NOC.core.combotree.ComboTree",
    "NOC.main.notificationgroup.LookupField",
    "NOC.main.template.LookupField",
  ],
  model: "NOC.fm.alarmtrigger.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
    },
    {
      text: t("header-enabled"),
      dataIndex: "is_enabled",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-alarm-class-re"),
      dataIndex: "alarm_class_re",
    },
    {
      text: t("label-condition"),
      dataIndex: "condition",
    },
    {
      text: t("header-time-pattern"),
      dataIndex: "time_pattern",
      renderer: NOC.render.Lookup("time_pattern"),
    },
    {
      text: t("label-resource-group"),
      dataIndex: "resource_group",
      renderer: NOC.render.Lookup("resource_group"),
    },
    {
      text: t("app-title-notificationgroup"),
      dataIndex: "notification_group",
      renderer: NOC.render.Lookup("notification_group"),
    },
    {
      text: t("header-template"),
      dataIndex: "template",
      renderer: NOC.render.Lookup("template"),
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
    },
    {
      name: "is_enabled",
      xtype: "checkboxfield",
      boxLabel: t("label-is-enabled"),
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      allowBlank: true,
    },
    {
      name: "alarm_class_re",
      xtype: "textfield",
      fieldLabel: t("label-alarm-class-re"),
      allowBlank: false,
    },
    {
      name: "condition",
      xtype: "textfield",
      fieldLabel: t("label-condition"),
      allowBlank: false,
    },
    {
      name: "time_pattern",
      xtype: "main.timepattern.LookupField",
      fieldLabel: t("header-time-pattern"),
      allowBlank: true,
    },
    {
      name: "resource_group",
      xtype: "noc.core.combotree",
      restUrl: "/inv/resourcegroup/",
      fieldLabel: t("label-resource-group"),
      listWidth: 1,
      listAlign: "left",
      labelAlign: "left",
      width: 500,
    },
    {
      name: "notification_group",
      xtype: "main.notificationgroup.LookupField",
      fieldLabel: t("app-title-notificationgroup"),
      allowBlank: true,
    },
    {
      name: "template",
      xtype: "main.template.LookupField",
      fieldLabel: t("header-template"),
      allowBlank: true,
    },
    {
      name: "handler",
      xtype: "textfield",
      fieldLabel: t("app-title-handler"),
      allowBlank: true,
      vtype: "handler",
    },
  ],
  filters: [
    {
      title: t("app-title-by-enabled"),
      name: "is_enabled",
      ftype: "boolean",
    },
  ],
});
