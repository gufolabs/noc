//---------------------------------------------------------------------
// fm.alarmrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmrule.Application");

Ext.define("NOC.fm.alarmrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.alarmrule.Model",
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.core.tagfield.Tagfield",
    "NOC.fm.alarmclass.LookupField",
    "NOC.fm.alarmseverity.LookupField",
    "NOC.fm.escalationprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.main.handler.LookupField",
    "NOC.sa.action.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.fm.alarmrule.Model",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 300,
          align: "left",
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 100,
          align: "left",
        },
        {
          text: t("app-title-escalationprofile"),
          dataIndex: "escalation_profile",
          width: 200,
          renderer: NOC.render.Lookup("escalation_profile"),
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "large",
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
          uiStyle: "large",
        },
        {
          xtype: "fieldset",
          title: t("app-title-severity-policy"),
          layout: "hbox",
          defaults: {
            labelAlign: "left",
            margin: 5,
          },
          items: [
            {
              name: "severity_policy",
              xtype: "combobox",
              fieldLabel: t("app-title-severity-policy"),
              allowBlank: true,
              store: [
                ["B", t("msg-class-based-policy")],
                ["AB", t("msg-affected-based-severity-preferred")],
                ["AL", t("msg-affected-limit")],
                ["ST", t("msg-by-tokens")],
              ],
              uiStyle: "medium",
              value: "AL",
            },
            {
              name: "min_severity",
              xtype: "fm.alarmseverity.LookupField",
              fieldLabel: t("label-min-set-severity"),
              uiStyle: "medium",
              allowBlank: true,
            },
            {
              name: "max_severity",
              xtype: "fm.alarmseverity.LookupField",
              fieldLabel: t("label-max-set-severity"),
              uiStyle: "medium",
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-ttl-policy"),
          layout: "hbox",
          defaults: {
            labelAlign: "left",
            margin: 5,
          },
          items: [
            {
              name: "ttl_policy",
              xtype: "combobox",
              fieldLabel: t("label-tt-policy"),
              store: [
                ["D", t("status-disable")],
                ["C", t("msg-after-create")],
                ["U", t("msg-after-update")],
              ],
              value: "continue",
              uiStyle: "medium",
            },
            {
              name: "clear_after_delay",
              xtype: "numberfield",
              fieldLabel: t("label-clear-after-sec"),
              allowBlank: true,
              min: 0,
              uiStyle: "small",
            },
          ],
        },
        {
          name: "escalation_profile",
          xtype: "fm.escalationprofile.LookupField",
          fieldLabel: t("app-title-escalationprofile"),
          uiStyle: "medium",
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-action"),
          layout: "hbox",
          defaults: {
            labelAlign: "left",
            margin: 5,
          },
          items: [
            {
              name: "rule_action",
              xtype: "combobox",
              fieldLabel: t("label-rule-action"),
              store: [
                ["continue", t("msg-continue")],
                ["drop", t("msg-drop-alarm")],
                ["rewrite", t("msg-rewrite")],
              ],
              value: "continue",
              uiStyle: "medium",
            },
            {
              name: "rule_apply_delay",
              xtype: "numberfield",
              fieldLabel: t("label-apply-after-sec"),
              allowBlank: true,
              min: 0,
              uiStyle: "small",
            },
            {
              name: "alarm_class",
              xtype: "fm.alarmclass.LookupField",
              fieldLabel: t("app-title-alarmclass"),
              uiStyle: "large",
              allowBlank: true,
            },
          ],
        },
        {
          name: "groups",
          xtype: "gridfield",
          fieldLabel: t("label-group-alarm"),
          columns: [
            {
              text: t("header-minimum-alarms"),
              dataIndex: "min_threshold",
              editor: {
                xtype: "numberfield",
              },
              minValue: 0,
              defaultValue: 0,
              width: 50,
            },
            {
              text: t("header-maximum-alarms"),
              dataIndex: "max_threshold",
              editor: {
                xtype: "numberfield",
              },
              minValue: 0,
              defaultValue: 1,
              width: 50,
            },
            {
              text: t("header-window-sec"),
              dataIndex: "window",
              editor: {
                xtype: "numberfield",
              },
              minValue: 0,
              defaultValue: 0,
              width: 50,
            },
            {
              text: t("header-reference-template"),
              dataIndex: "reference_template",
              editor: "textfield",
              width: 250,
            },
            {
              text: t("app-title-alarmclass"),
              dataIndex: "alarm_class",
              editor: "fm.alarmclass.LookupField",
              renderer: NOC.render.Lookup("alarm_class"),
              width: 200,
            },
            {
              text: t("header-title-template"),
              dataIndex: "title_template",
              editor: "textfield",
              allowBlank: true,
              width: 200,
            },
            {
              text: t("header-labels"),
              dataIndex: "labels",
              renderer: NOC.render.LabelField,
              allowBlank: true,
              editor: {
                xtype: "labelfield",
                query: {
                  "allow_models": ["fm.Alarm"],
                } },
              width: 200,
            },
          ],
        },
        {
          name: "actions",
          xtype: "gridfield",
          fieldLabel: t("nav-action"),
          columns: [
            {
              text: t("header-when-do"),
              dataIndex: "when",
              width: 100,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["raise", t("msg-on-alarm-raise")],
                  ["update", t("msg-on-update")],
                  ["clear", t("msg-on-alarm-clear")],
                ],
              },
              renderer: NOC.render.Choices({
                "raise": t("msg-on-alarm-raise"),
                "clear": t("msg-on-alarm-clear"),
              }),
            },
            {
              text: t("app-title-notificationgroup"),
              dataIndex: "notification_group",
              editor: "main.notificationgroup.LookupField",
              width: 150,
              allowBlank: true,
              renderer: NOC.render.Lookup("notification_group"),
            },
            {
              text: t("header-template"),
              dataIndex: "template",
              editor: "main.template.LookupField",
              width: 150,
              allowBlank: true,
              renderer: NOC.render.Lookup("template"),
            },
            {
              text: t("header-object-action"),
              dataIndex: "object_action",
              editor: "sa.action.LookupField",
              width: 150,
              allowBlank: true,
              renderer: NOC.render.Lookup("object_action"),
            },
            {
              text: t("btn-message"),
              dataIndex: "message",
              editor: "textfield",
              allowBlank: true,
              width: 200,
            },
            {
              text: t("app-title-handler"),
              dataIndex: "handler",
              editor: {
                xtype: "main.handler.LookupField",
                query: {
                  "allow_fm_alarm": true,
                },
              },
              renderer: NOC.render.Lookup("handler"),
              width: 200,
            },
          ],
        },
        {
          name: "match",
          xtype: "listform",
          fieldLabel: t("label-match-rules"),
          rows: 5,
          items: [
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: true,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
            {
              name: "exclude_labels",
              xtype: "labelfield",
              fieldLabel: t("label-exclude-match-labels"),
              allowBlank: true,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
            {
              name: "alarm_class",
              xtype: "fm.alarmclass.LookupField",
              fieldLabel: t("app-title-alarmclass"),
              uiStyle: "large",
              allowBlank: true,
            },
            {
              xtype: "core.tagfield",
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "resource_groups",
              allowBlank: true,
              uiStyle: "extra",
            },
            {
              name: "severity",
              xtype: "fm.alarmseverity.LookupField",
              fieldLabel: t("app-title-alarmseverity"),
              uiStyle: "medium",
              allowBlank: true,
            },
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "reference_rx",
              xtype: "textfield",
              fieldLabel: t("label-group-reference-regex"),
              uiStyle: "large",
              allowBlank: true,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
