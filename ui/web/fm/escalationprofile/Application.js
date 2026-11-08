//---------------------------------------------------------------------
// fm.escalationprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.escalationprofile.Application");

Ext.define("NOC.fm.escalationprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.escalationprofile.Model",
    "NOC.fm.ttsystem.LookupField",
    "NOC.fm.alarmseverity.LookupField",
    "NOC.main.template.LookupField",
    "NOC.aaa.user.LookupField",
    "NOC.aaa.group.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.main.timepattern.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.fm.escalationprofile.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 250,
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
          name: "escalation_policy",
          xtype: "combobox",
          fieldLabel: t("label-group-escalation-policy"),
          allowBlank: false,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "0", label: "Never Items"},
              {id: "1", label: "Start From Root"},
              {id: "2", label: "Only if Root"},
              {id: "3", label: "From First"},
              {id: "4", label: "Current Alarm"},
            ],
          },
          uiStyle: "medium",
        },
        {
          name: "maintenance_policy",
          xtype: "combobox",
          fieldLabel: t("label-escalate-maintenance-policy"),
          allowBlank: true,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "w", label: "Wait End Maintenance"},
              {id: "i", label: "Ignore Maintenance"},
              {id: "e", label: "End Escalation"}],
          },
          uiStyle: "medium",
        },
        {
          name: "alarm_consequence_policy",
          xtype: "combobox",
          fieldLabel: t("label-escalate-alarm-consequence-policy"),
          allowBlank: true,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "D", label: "Disable"},
              {id: "a", label: "Escalate with alarm timestamp"},
              {id: "c", label: "Escalate with current timestamp"}],
          },
          uiStyle: "medium",
        },
        {
          name: "end_condition",
          xtype: "combobox",
          fieldLabel: t("label-end-condition"),
          allowBlank: false,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "CR", label: "Close Root"},
              {id: "CA", label: "Close All"},
              {id: "E", label: "End Escalation"},
              {id: "CT", label: "Close TT"},
              {id: "M", label: "Manual"}],
          },
          uiStyle: "medium",
        },
        {
          name: "repeat_escalations",
          xtype: "combobox",
          fieldLabel: t("label-repeat-escalations"),
          allowBlank: false,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "N", label: "Newer"},
              {id: "S", label: "Severity Change"},
              {id: "D", label: "After delay"}],
          },
          uiStyle: "medium",
        },
        {
          name: "tt_system_config",
          xtype: "gridfield",
          fieldLabel: t("label-tt-system-config"),
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
              width: 150,
            },
            {
              text: t("header-login"),
              dataIndex: "login",
              editor: "textfield",
              width: 150,
            },
          ],
        },
        {
          name: "actions",
          xtype: "gridfield",
          fieldLabel: t("nav-action"),
          columns: [
            {
              text: t("header-user"),
              dataIndex: "user",
              editor: "aaa.user.LookupField",
              renderer: NOC.render.Lookup("user"),
              width: 150,
            },
            {
              text: t("header-group"),
              dataIndex: "group",
              editor: "aaa.group.LookupField",
              renderer: NOC.render.Lookup("group"),
              width: 150,
            },
            {
              text: t("msg-ack"),
              dataIndex: "ack",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-add-log"),
              dataIndex: "log",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("btn-close"),
              dataIndex: "close",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("btn-subscribe"),
              dataIndex: "subscribe",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
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
              text: t("header-match-ack"),
              dataIndex: "alarm_ack",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["ack", t("msg-acknowledge")],
                  ["nack", t("msg-not-acknowledge")],
                  ["any", t("msg-any")],
                ],
              },
              renderer: NOC.render.Choices({
                "ack": t("msg-acknowledge"),
                "nack": t("msg-not-acknowledge"),
                "any": t("msg-any"),
              }),
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
              editor: "fm.alarmseverity.LookupField",
              width: 120,
              renderer: NOC.render.Lookup("min_severity"),
            },
            {
              text: t("app-title-ttsystem"),
              dataIndex: "tt_system",
              editor: "fm.ttsystem.LookupField",
              width: 120,
              renderer: NOC.render.Lookup("tt_system"),
            },
            {
              text: t("header-tt-queue"),
              dataIndex: "tt_queue",
              editor: "textfield",
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
              width: 150,
              renderer: NOC.render.Lookup("template"),
            },
            {
              text: t("header-close-template"),
              dataIndex: "close_template",
              editor: "main.template.LookupField",
              width: 150,
              renderer: NOC.render.Lookup("close_template"),
            },
            {
              text: t("label-tt"),
              dataIndex: "create_tt",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-register-msg"),
              dataIndex: "register_message",
              editor: "checkboxfield",
              width: 50,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-acl-policy"),
              dataIndex: "ack_policy",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["D", t("msg-disabled")],
                  ["U", t("msg-unack")],
                  ["A", t("msg-ack-user")],
                  ["S", t("msg-ack-subscriber")],
                ],
              },
              renderer: NOC.render.Choices({
                "D": t("msg-disabled"),
                "U": t("msg-unack"),
                "A": t("msg-ack-user"),
                "S": t("msg-ack-subscriber"),
              }),
            },
            {
              text: t("header-assigned-user"),
              dataIndex: "assigned_user",
              editor: "aaa.user.LookupField",
              renderer: NOC.render.Lookup("assigned_user"),
              width: 150,
            },
            {
              text: t("header-repeat"),
              dataIndex: "repeat",
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
        {
          name: "repeat_delay",
          xtype: "numberfield",
          fieldLabel: t("label-repeat-delay"),
          allowBlank: true,
          min: 30,
          uiStyle: "small",
        },
        {
          name: "telemetry_sample",
          xtype: "numberfield",
          fieldLabel: t("label-tememetry-sample"),
          allowBlank: true,
          min: 0,
          uiStyle: "small",
        },
      ],
    });
    me.callParent();
  },
});
