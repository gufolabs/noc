//---------------------------------------------------------------------
// fm.ttsystem application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.ttsystem.Application");

Ext.define("NOC.fm.ttsystem.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.ttsystem.Model",
    "NOC.main.remotesystem.LookupField",
  ],
  model: "NOC.fm.ttsystem.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 50,
          renderer: NOC.render.Bool,
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
          name: "is_active",
          xtype: "checkbox",
          fieldLabel: t("header-active"),
          allowBlank: false,
        },
        {
          name: "handler",
          xtype: "textfield",
          fieldLabel: t("app-title-handler"),
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "connection",
          xtype: "textfield",
          fieldLabel: t("header-connection"),
          allowBlank: false,
        },
        {
          name: "login",
          xtype: "textfield",
          fieldLabel: t("header-login"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "shard_name",
          xtype: "textfield",
          fieldLabel: t("label-shard"),
          regex: /^[0-9a-zA-Z]{1,16}$/,
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "max_threads",
          xtype: "numberfield",
          fieldLabel: t("label-max-threads"),
          allowBlank: false,
          min: 0,
          uiStyle: "small",
        },
        {
          name: "failure_cooldown",
          xtype: "numberfield",
          fieldLabel: t("label-failure-cooldown"),
          allowBlank: true,
          min: 0,
          uiStyle: "small",
        },
        {
          name: "alarm_consequence_policy",
          xtype: "combobox",
          fieldLabel: t("label-escalate-alarm-consequence-policy"),
          allowBlank: false,
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
          name: "promote_items",
          xtype: "combobox",
          fieldLabel: t("label-escalate-items-add-policy"),
          allowBlank: false,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "D", label: "Disable"},
              {id: "T", label: "Items with TTSystem set"},
              {id: "R", label: "Items with RemoteSystem set"},
              {id: "I", label: "Any Items"}],
          },
          uiStyle: "medium",
        },
        {
          name: "telemetry_sample",
          xtype: "numberfield",
          fieldLabel: t("label-telemetry-sample"),
          allowBlank: false,
          min: 0,
          uiStyle: "small",
        },
        {
          name: "check_updates_interval",
          xtype: "numberfield",
          fieldLabel: t("label-check-updates-interval"),
          allowBlank: true,
          min: 0,
          uiStyle: "small",
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "remote_id",
              xtype: "textfield",
              fieldLabel: t("label-remote-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "bi_id",
              xtype: "displayfield",
              fieldLabel: t("label-bi-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
