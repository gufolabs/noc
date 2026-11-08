//---------------------------------------------------------------------
// main.remotesystem application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.remotesystem.Application");

Ext.define("NOC.main.remotesystem.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.remotesystem.Model",
    "Ext.ux.form.GridField",
    "NOC.aaa.apikey.LookupField",
  ],
  model: "NOC.main.remotesystem.Model",
  search: true,
  helpId: "reference-remote-system",

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
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
          uiStyle: "extra",
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "handler",
          xtype: "textfield",
          fieldLabel: t("app-title-handler"),
          allowBlank: false,
          uiStyle: "extra",
        },
        {
          xtype: "fieldset",
          title: t("app-title-extractors-loaders"),
          items: [
            {
              name: "enable_address",
              xtype: "checkbox",
              boxLabel: t("app-title-address"),
            },
            {
              name: "enable_admdiv",
              xtype: "checkbox",
              boxLabel: t("label-administrative-territorial-division"),
            },
            {
              name: "enable_administrativedomain",
              xtype: "checkbox",
              boxLabel: t("header-administrative-domain-d113be"),
            },
            {
              name: "enable_authprofile",
              xtype: "checkbox",
              boxLabel: t("app-title-authprofile"),
            },
            {
              name: "enable_building",
              xtype: "checkbox",
              boxLabel: t("app-title-building"),
            },
            {
              name: "enable_container",
              xtype: "checkbox",
              boxLabel: t("label-container-2"),
            },
            {
              name: "enable_link",
              xtype: "checkbox",
              boxLabel: t("msg-link"),
            },
            {
              name: "enable_managedobject",
              xtype: "checkbox",
              boxLabel: t("header-managed-object-62561c"),
            },
            {
              name: "managed_object_loader_policy",
              xtype: "combobox",
              fieldLabel: t("label-managed-object-loader-policy"),
              store: [
                ["M", t("msg-as-managed-object")],
                ["D", t("msg-as-discovered")],
              ],
              value: "M",
            },
            {
              name: "enable_managedobjectprofile",
              xtype: "checkbox",
              boxLabel: t("app-title-managedobjectprofile"),
            },
            {
              name: "enable_networksegment",
              xtype: "checkbox",
              boxLabel: t("app-title-networksegment"),
            },
            {
              name: "enable_networksegmentprofile",
              xtype: "checkbox",
              boxLabel: t("app-title-networksegmentprofile"),
            },
            {
              name: "enable_object",
              xtype: "checkbox",
              boxLabel: t("header-object"),
            },
            {
              name: "enable_sensor",
              xtype: "checkbox",
              boxLabel: t("app-title-sensor"),
            },
            {
              name: "enable_service",
              xtype: "checkbox",
              boxLabel: t("header-service"),
            },
            {
              name: "enable_serviceprofile",
              xtype: "checkbox",
              boxLabel: t("app-title-serviceprofile"),
            },
            {
              name: "enable_ipvrf",
              xtype: "checkbox",
              boxLabel: t("label-ip-vrf"),
            },
            {
              name: "enable_ipprefix",
              xtype: "checkbox",
              boxLabel: t("msg-ip-prefix"),
            },
            {
              name: "enable_ipprefixprofile",
              xtype: "checkbox",
              boxLabel: t("label-ip-prefix-profile"),
            },
            {
              name: "enable_ipaddress",
              xtype: "checkbox",
              boxLabel: t("label-ip-address"),
            },
            {
              name: "enable_ipaddressprofile",
              xtype: "checkbox",
              boxLabel: t("msg-ip-address-profile"),
            },
            {
              name: "enable_street",
              xtype: "checkbox",
              boxLabel: t("app-title-street"),
            },
            {
              name: "enable_subscriber",
              xtype: "checkbox",
              boxLabel: t("header-subscriber"),
            },
            {
              name: "enable_subscriberprofile",
              xtype: "checkbox",
              boxLabel: t("app-title-subscriberprofile"),
            },
            {
              name: "enable_resourcegroup",
              xtype: "checkbox",
              boxLabel: t("label-resource-group"),
            },
            {
              name: "enable_l2domain",
              xtype: "checkbox",
              boxLabel: t("header-l2-domain"),
            },
            {
              name: "enable_ttsystem",
              xtype: "checkbox",
              boxLabel: t("app-title-ttsystem"),
            },
            {
              name: "enable_project",
              xtype: "checkbox",
              boxLabel: t("label-project"),
            },
            {
              name: "enable_maintenance",
              xtype: "checkbox",
              boxLabel: t("label-maintenances"),
            },
            {
              name: "enable_label",
              xtype: "checkbox",
              boxLabel: t("header-labels"),
            },
            {
              name: "enable_pmagent",
              xtype: "checkbox",
              boxLabel: t("label-pm-agent"),
            },
            {
              name: "enable_fmevent",
              xtype: "checkbox",
              boxLabel: t("label-enable-fm-event"),
            },
            {
              name: "event_sync_mode",
              xtype: "combobox",
              fieldLabel: t("label-event-sync-mode"),
              store: [
                ["I", t("msg-incremental")],
                ["S", t("msg-snapshot")],
                ["P", t("msg-push-collector")],
              ],
              value: "I",
            },
            {
              name: "enable_metrics",
              xtype: "checkbox",
              boxLabel: t("label-enable-metrics"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "vbox",
          title: t("app-title-collector-settings"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "remote_collectors_policy",
              xtype: "combobox",
              fieldLabel: t("label-enable-received"),
              allowBlank: false,
              labelWidth: 200,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              defaultValue: "M",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "D", label: "Disable"},
                  {id: "E", label: "Enable (Any)"},
                  {id: "S", label: "Strict (Map Only)"},
                ],
              },
              uiStyle: "medium",
            },
            {
              name: "api_key",
              xtype: "aaa.apikey.LookupField",
              fieldLabel: t("label-api-key"),
              allowBlank: true,
            },
            {
              name: "remote_collectors_batch_signal",
              xtype: "combobox",
              fieldLabel: t("label-metric-batch-signal"),
              allowBlank: true,
              labelWidth: 200,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              defaultValue: "A",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "A", label: "Delay & Count Condition"},
                  {id: "D", label: "Delay Only"},
                  {id: "B", label: "Records Count Only"},
                ],
              },
              uiStyle: "medium",
            },
            {
              name: "metrics_batch_delay",
              xtype: "numberfield",
              fieldLabel: t("label-metric-batch-delay-sec"),
              labelWidth: 200,
              uiStyle: "small",
              minValue: 5,
              defaultValue: 10,
              listeners: {
                scope: me,
                change: function(_item, newValue){
                  me.form.findField("metrics_batch_delay").setValue(newValue);
                },
              },
            },
            {
              name: "metrics_min_batch_size",
              xtype: "numberfield",
              fieldLabel: t("label-metric-batch-delay-sec"),
              labelWidth: 200,
              uiStyle: "small",
              defaultValue: 5000,
              minValue: 0,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "vbox",
          title: t("app-title-sync-settings"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "sync_policy",
              xtype: "combobox",
              fieldLabel: t("label-sync-policy"),
              allowBlank: false,
              labelWidth: 200,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              defaultValue: "M",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "M", label: "Manual"},
                  {id: "P", label: "Period"},
                  {id: "C", label: "Cron"},
                ],
              },
              uiStyle: "medium",
            },
            {
              name: "sync_interval",
              xtype: "numberfield",
              fieldLabel: t("label-sync-interval-sec"),
              labelWidth: 200,
              uiStyle: "small",
              minValue: 0,
              listeners: {
                scope: me,
                change: function(_item, newValue){
                  me.form.findField("sync_interval").setValue(newValue);
                },
              },
            },
            {
              name: "run_sync_at",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("label-run-sync-at"),
              allowBlank: true,
              format: "d-M-Y H:i",
              submitFormat: "Y-m-d\\TH:i:s",
              width: 312, // for NOC theme
              altFormats: "Y-m-d H:i:s|Y-m-d\\TH:i:s|Y-m-d H:i|d.m.Y H:i|d.m.Y",
              getModelData: function(){
                var v = this.getValue(),
                  o = {};
                o[this.getName()] = v ? Ext.Date.format(v, "Y-m-d\\TH:i:s") : null;
                return o;
              },
            },
            {
              name: "event_sync_interval",
              xtype: "numberfield",
              fieldLabel: t("label-event-sync-interval-sec"),
              labelWidth: 200,
              allowBlank: false,
              uiStyle: "small",
              minValue: 0,
              listeners: {
                scope: me,
                change: function(_item, newValue){
                  me.form.findField("event_sync_interval").setValue(newValue);
                },
              },
            },
            {
              name: "sync_notification",
              xtype: "combobox",
              fieldLabel: t("label-sync-notification-policy"),
              labelWidth: 200,
              queryMode: "local",
              displayField: "label",
              valueField: "id",
              defaultValue: "F",
              store: {
                fields: ["id", "label"],
                data: [
                  {id: "D", label: "Disable"},
                  {id: "F", label: "Failed Only"},
                  {id: "A", label: "All"},
                ],
              },
              uiStyle: "medium",
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-synd-data"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "last_extract",
              xtype: "displayfield",
              fieldLabel: t("label-last-extract"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "last_load",
              xtype: "displayfield",
              fieldLabel: t("label-last-load"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "last_extract_event",
              xtype: "displayfield",
              fieldLabel: t("label-last-extract-event"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "object_url_template",
          xtype: "textfield",
          fieldLabel: t("label-object-url-template"),
          allowBlank: true,
          uiStyle: "extra",
        },
        {
          name: "portmapper_name",
          xtype: "textfield",
          fieldLabel: t("label-pormapper-name"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "environment",
          xtype: "gridfield",
          fieldLabel: t("label-environment"),
          columns: [
            {
              text: t("header-key"),
              dataIndex: "key",
              width: 200,
              editor: "textfield",
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              flex: 1,
              editor: "textfield",
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
