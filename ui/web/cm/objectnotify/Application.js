//---------------------------------------------------------------------
// cm.objectnotify application
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.cm.objectnotify.Application");

Ext.define("NOC.cm.objectnotify.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.cm.objectnotify.Model",
    "NOC.core.combotree.ComboTree",
    "NOC.cm.objectnotify.LookupField",
    "NOC.main.notificationgroup.LookupField",
  ],
  model: "NOC.cm.objectnotify.Model",
  recordReload: true,
  maskElement: "el",
  initComponent: function(){
    var me = this;
    me.typeField = Ext.create({xtype: "cm.objectnotify.LookupField"});
    Ext.apply(me, {
      columns: [
        {
          text: t("header-type"),
          dataIndex: "type",
          renderer: me.type_render,
          width: 200,
        },
        {
          text: t("header-adm-domain"),
          dataIndex: "administrative_domain",
          renderer: NOC.render.Lookup("administrative_domain"),
          width: 200,
        },
        {
          text: t("app-title-notificationgroup"),
          dataIndex: "notification_group",
          renderer: NOC.render.Lookup("notification_group"),
          width: 200,
        },
        {
          text: t("header-immediately"),
          dataIndex: "notify_immediately",
          width: 100,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-delayed"),
          dataIndex: "notify_delayed",
          width: 100,
          renderer: NOC.render.Bool,
        },
      ],
      fields: [
        {
          xtype: "cm.objectnotify.LookupField",
          fieldLabel: t("header-type"),
          name: "type",
          uiStyle: "medium",
        },
        {
          xtype: "noc.core.combotree",
          restUrl: "/sa/administrativedomain/",
          fieldLabel: t("header-adm-domain"),
          name: "administrative_domain",
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "notify_immediately",
          xtype: "checkboxfield",
          boxLabel: t("label-notify-immediately"),
          boxLabelAlign: "before",
          allowBlank: false,
          uiStyle: "small",
        },
        {
          name: "notify_delayed",
          xtype: "checkboxfield",
          boxLabel: t("label-notify-delayed"),
          boxLabelAlign: "before",
          allowBlank: false,
          uiStyle: "small",
        },
        {
          name: "notification_group",
          xtype: "main.notificationgroup.LookupField",
          fieldLabel: t("app-title-notificationgroup"),
          width: 400,
          allowBlank: true,
          uiStyle: "medium",
        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-immediately"),
      name: "notify_immediately",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-delayed"),
      name: "notify_delayed",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-adm-domain"),
      name: "administrative_domain",
      ftype: "tree",
      lookup: "sa.administrativedomain",
    },
    {
      title: t("app-title-by-type"),
      name: "type",
      ftype: "lookup",
      lookup: "cm.objectnotify",
    },
  ],
  type_render: function(value){
    return this.up().typeField.getStore().findRecord("value", value).get("text");
  },
});