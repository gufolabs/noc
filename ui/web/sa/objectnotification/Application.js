//---------------------------------------------------------------------
// sa.objectnotification application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.objectnotification.Application");

Ext.define("NOC.sa.objectnotification.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.sa.objectnotification.Model",
    "NOC.main.notificationgroup.LookupField",
    "NOC.core.combotree.ComboTree",
  ],
  model: "NOC.sa.objectnotification.Model",
  columns: [
    {
      text: t("label-resource-group"),
      dataIndex: "resource_group",
      renderer: NOC.render.Lookup("resource_group"),
      width: 200,
    },
    {
      text: t("header-notification"),
      dataIndex: "notification_group",
      renderer: NOC.render.Lookup("notification_group"),
      width: 200,
    },
    {
      text: t("header-config-changed"),
      dataIndex: "config_changed",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-alarm-risen"),
      dataIndex: "alarm_risen",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-alarm-reopened"),
      dataIndex: "alarm_reopened",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-alarm-cleared"),
      dataIndex: "alarm_cleared",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-alarm-commented"),
      dataIndex: "alarm_commented",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-new"),
      dataIndex: "new",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("msg-deleted-2"),
      dataIndex: "deleted",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-version-changed"),
      dataIndex: "version_changed",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-script-failed"),
      dataIndex: "script_failed",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-config-policy-violation"),
      dataIndex: "config_policy_violation",
      width: 50,
      renderer: NOC.render.Bool,
    },
  ],
  fields: [
    {
      name: "resource_group",
      xtype: "noc.core.combotree",
      restUrl: "/inv/resourcegroup/",
      fieldLabel: t("label-resource-group"),
      listWidth: 1,
      listAlign: "left",
      labelAlign: "left",
      width: 500,
      allowBlank: false,
    },
    {
      name: "notification_group",
      xtype: "main.notificationgroup.LookupField",
      fieldLabel: t("app-title-notificationgroup"),
      allowBlank: false,
    },
    {
      name: "config_changed",
      xtype: "checkboxfield",
      boxLabel: t("label-config-changed"),
    },
    {
      name: "alarm_risen",
      xtype: "checkboxfield",
      boxLabel: t("label-alarm-risen"),
    },
    {
      name: "alarm_reopened",
      xtype: "checkboxfield",
      boxLabel: t("label-alarm-reopened"),
    },
    {
      name: "alarm_cleared",
      xtype: "checkboxfield",
      boxLabel: t("msg-alarm-cleared"),
    },
    {
      name: "alarm_commented",
      xtype: "checkboxfield",
      boxLabel: t("label-alarm-commented"),
    },
    {
      name: "new",
      xtype: "checkboxfield",
      boxLabel: t("header-new"),
    },
    {
      name: "deleted",
      xtype: "checkboxfield",
      boxLabel: t("msg-deleted-2"),
    },
    {
      name: "version_changed",
      xtype: "checkboxfield",
      boxLabel: t("label-version-changed"),
    },
    {
      name: "interface_changed",
      xtype: "checkboxfield",
      boxLabel: t("label-interface-changed"),
    },
    {
      name: "script_failed",
      xtype: "checkboxfield",
      boxLabel: t("label-script-failed"),
    },
    {
      name: "config_policy_violation",
      xtype: "checkboxfield",
      boxLabel: t("label-config-policy-violation"),
    },
  ],
});
