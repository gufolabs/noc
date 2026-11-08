//---------------------------------------------------------------------
// fm.alarmescalation application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmescalation.Application");

Ext.define("NOC.fm.alarmescalation.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.alarmescalation.Model",
    "NOC.sa.administrativedomain.LookupField",
    "NOC.fm.alarmclass.LookupField",
    "NOC.fm.ttsystem.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.main.timepattern.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.fm.alarmescalation.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
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
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "global_limit",
          xtype: "numberfield",
          fieldLabel: t("label-global-limit"),
          allowBlank: true,
          uiStyle: "small",
        },
        {
          name: "max_escalation_retries",
          xtype: "numberfield",
          fieldLabel: t("label-escalation-retries"),
          allowBlank: false,
          min: 0,
          uiStyle: "small",
        },
        {
          name: "alarm_classes",
          xtype: "gridfield",
          fieldLabel: t("nav-alarmclass"),
          columns: [
            {
              text: t("app-title-alarmclass"),
              dataIndex: "alarm_class",
              editor: "fm.alarmclass.LookupField",
              renderer: NOC.render.Lookup("alarm_class"),
              flex: 1,
            },
          ],
        },
        {
          name: "pre_reasons",
          xtype: "gridfield",
          fieldLabel: t("label-pre-reasons"),
          columns: [
            {
              text: t("app-title-ttsystem"),
              dataIndex: "tt_system",
              editor: "fm.ttsystem.LookupField",
              renderer: NOC.render.Lookup("tt_system"),
              width: 150,
            },
            {
              text: t("header-pre-reason"),
              dataIndex: "pre_reason",
              editor: "textfield",
              flex: 1,
            },
          ],
        },
        {
          name: "escalations",
          xtype: "gridfield",
          fieldLabel: t("app-title-reportescalations"),
          columns: [
            {
              text: t("label-delay"),
              dataIndex: "delay",
              editor: "numberfield",
              width: 75,
            },
            {
              text: t("header-adm-domain-2"),
              dataIndex: "administrative_domain",
              editor: "sa.administrativedomain.LookupField",
              width: 150,
              renderer: NOC.render.Lookup("administrative_domain"),
            },
            {
              text: t("label-resource-group"),
              dataIndex: "resource_group",
              editor: "inv.resourcegroup.LookupField",
              width: 150,
              renderer: NOC.render.Lookup("resource_group"),
            },
            {
              text: t("header-time-pattern"),
              dataIndex: "time_pattern",
              editor: "main.timepattern.LookupField",
              renderer: NOC.render.Lookup("time_pattern"),
            },
            {
              text: t("header-severity"),
              dataIndex: "min_severity",
              editor: "numberfield",
              width: 70,
            },
            {
              text: t("app-title-notificationgroup"),
              dataIndex: "notification_group",
              editor: "main.notificationgroup.LookupField",
              width: 150,
              renderer: NOC.render.Lookup("notification_group"),
            },
            {
              text: t("header-open-template"),
              dataIndex: "template",
              editor: "main.template.LookupField",
              width: 100,
              renderer: NOC.render.Lookup("template"),
            },
            {
              text: t("header-clear-template"),
              dataIndex: "clear_template",
              editor: "main.template.LookupField",
              width: 100,
              renderer: NOC.render.Lookup("clear_template"),
            },
            {
              text: t("label-tt"),
              dataIndex: "create_tt",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-gtt"),
              dataIndex: "promote_group_tt",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-att"),
              dataIndex: "promote_affected_tt",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("label-wait-tt"),
              dataIndex: "wait_tt",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-close-tt"),
              dataIndex: "close_tt",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-stop"),
              dataIndex: "stop_processing",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
