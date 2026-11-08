//---------------------------------------------------------------------
// sa.serviceprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.serviceprofile.Application");

Ext.define("NOC.sa.serviceprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.sa.serviceprofile.Model",
    "NOC.sa.serviceprofile.LookupField",
    "NOC.sa.capsprofile.LookupField",
    "NOC.main.glyph.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.handler.LookupField",
    "NOC.inv.interfaceprofile.LookupField",
    "NOC.inv.capability.LookupField",
    "NOC.inv.resourcegroup.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.fm.alarmseverity.LookupField",
    "NOC.fm.alarmclass.LookupField",
  ],
  model: "NOC.sa.serviceprofile.Model",
  search: true,
  helpId: "reference-service-profile",

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("label-icon"),
          dataIndex: "glyph",
          width: 25,
          renderer: function(v){
            if(v !== undefined && v !== "")
            {
              return "<i class='" + v + "'></i>";
            } else{
              return "";
            }
          },
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("label-code"),
          dataIndex: "code",
          width: 100,
        },
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 150,
          renderer: NOC.render.Lookup("workflow"),
        },
        {
          text: t("header-summary"),
          dataIndex: "show_in_summary",
          width: 50,
          renderer: NOC.render.Bool,
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
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "card_title_template",
          xtype: "textfield",
          fieldLabel: t("header-title-template"),
          uiStyle: "extra",
          allowBlank: true,
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: false,
        },
        {
          xtype: "fieldset",
          title: t("app-title-display"),
          layout: {
            type: "vbox",
          },
          items: [
            {
              name: "show_in_summary",
              xtype: "checkbox",
              boxLabel: t("label-show-in-summary"),
              allowBlank: true,
            },
            {
              name: "glyph",
              xtype: "main.glyph.LookupField",
              fieldLabel: t("label-icon"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "display_order",
              xtype: "numberfield",
              fieldLabel: t("label-display-order"),
              uiStyle: "small",
              minValue: 0,
              allowBlank: false,
            },
          ],
        },
        {
          name: "caps_profile",
          xtype: "sa.capsprofile.LookupField",
          tooltip: t("help-set-which-caps-will-be-check-in-caps-discovery-br-service-activa"),
          fieldLabel: t("app-title-capsprofile"),
          allowBlank: true,
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "caps_exposed",
          xtype: "checkbox",
          boxLabel: t("label-exposed-caps-to-objects"),
          allowBlank: true,
        },
        {
          name: "interface_profile",
          xtype: "inv.interfaceprofile.LookupField",
          fieldLabel: t("app-title-interfaceprofile"),
          allowBlank: true,
        },
        {
          name: "weight",
          xtype: "numberfield",
          fieldLabel: t("label-service-weight"),
          allowBlank: true,
          uiStyle: "small",
        },
        {
          name: "status_change_notification",
          xtype: "combobox",
          fieldLabel: t("label-status-change-notification"),
          allowBlank: true,
          labelWidth: 200,
          defaultValue: "d",
          store: [
            ["d", t("msg-disabled")],
            ["e", t("btn-enable-message")],
          ],
          uiStyle: "medium",
        },
        {
          xtype: "fieldset",
          title: t("app-title-oper-status-transfer-2"),
          items: [
            {
              name: "status_transfer_policy",
              xtype: "combobox",
              fieldLabel: t("label-status-transfer-policy"),
              tooltip: t("help-transfer-children-status-to-operstatus-br-d-disable-status-trans"),
              store: [
                ["D", t("status-disable")],
                ["T", t("msg-transparent")],
                ["S", t("msg-self-status")],
              ],
              allowBlank: true,
              value: "S",
              uiStyle: "medium",
              listeners: {
                render: me.addTooltip,
              },
            },

          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-calculate-oper-status"),
          defaults: {
            padding: 4,
            labelAlign: "top",
          },
          items: [
            {
              name: "calculate_status_function",
              xtype: "combobox",
              fieldLabel: t("label-calculate-oper-status-policy"),
              tooltip: t("help-calculate-oper-status-br-d-disable-calculate-status-br-r-calcula"),
              store: [
                ["D", t("status-disable")],
                ["MX", t("msg-by-max-status")],
                ["MN", t("msg-by-min-status")],
                ["R", t("msg-by-rule")],
              ],
              allowBlank: true,
              value: "P",
              uiStyle: "medium",
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              name: "calculate_status_rules",
              fieldLabel: t("label-calculate-status-rules"),
              xtype: "gridfield",
              allowBlank: true,
              columns: [
                {
                  text: t("header-group"),
                  dataIndex: "group",
                  renderer: NOC.render.Lookup("group"),
                  width: 200,
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
                {
                  text: t("header-type"),
                  dataIndex: "type",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["S", "Service (Using)"],
                      ["C", "Client (Using)"],
                      ["T", "Parent (UP)"],
                      ["D", "Children (Down)"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "S": "Service (Using)",
                    "C": "Client (Using)",
                    "T": "Parent (UP)",
                    "D": "Children (Down)",
                  }),
                },
                {
                  text: t("btn-function"),
                  dataIndex: "weight_function",
                  width: 150,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["C", "Count"],
                      ["CP", "By Percent"],
                      ["MIN", "Minimal"],
                      ["MAX", "Maximum"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "C": "Count",
                    "CP": "By Percent",
                    "MIN": "Minimal",
                    "MAX": "Maximum",
                  }),
                },
                {
                  text: t("btn-op"),
                  dataIndex: "op",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["<=", "<="],
                      ["=", "="],
                      [">=", ">="],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "<=": "<=",
                    "=": "=",
                    ">=": ">=",
                  }),
                },
                {
                  text: t("btn-weight"),
                  dataIndex: "weight",
                  editor: {
                    xtype: "numberfield",
                  },
                },
                {
                  text: t("btn-min-status"),
                  dataIndex: "min_status",
                  width: 150,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-max-status"),
                  dataIndex: "max_status",
                  width: 150,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
                {
                  text: t("btn-to-status"),
                  dataIndex: "set_status",
                  width: 150,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-alarm-transfer"),
          items: [
            {
              name: "alarm_affected_policy",
              xtype: "combobox",
              fieldLabel: t("label-alarm-affected-policy"),
              tooltip: t("help-transfer-alarm-to-operstatus-br-d-disable-alarm-transfer-br-b-se"),
              store: [
                ["D", t("status-disable")],
                ["B", t("msg-by-service-component")],
                ["A", t("msg-by-instance")],
                ["O", t("msg-only-by-filter")],
              ],
              allowBlank: true,
              value: "A",
              uiStyle: "medium",
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              name: "alarm_status_rules",
              fieldLabel: t("label-alarm-status-rules"),
              xtype: "gridfield",
              allowBlank: true,
              //width: 350,
              columns: [
                {
                  dataIndex: "alarm_class_template",
                  text: t("label-alarm-class-re"),
                  editor: "textfield",
                  width: 300,
                  allowBlank: true,
                },
                {
                  text: t("label-match-labels"),
                  dataIndex: "include_labels",
                  renderer: NOC.render.LabelField,
                  editor: {
                    xtype: "labelfield",
                    query: {
                      "allow_matched": true,
                    },
                  },
                  width: 200,
                },
                {
                  text: t("btn-ref-only"),
                  dataIndex: "required_reference",
                  width: 100,
                  editor: "checkbox",
                  renderer: NOC.render.Bool,
                },
                {
                  text: t("btn-affected-instance"),
                  dataIndex: "affected_instance",
                  width: 100,
                  editor: "checkbox",
                  renderer: NOC.render.Bool,
                },
                {
                  text: t("btn-min-severity"),
                  dataIndex: "min_severity",
                  width: 200,
                  editor: "fm.alarmseverity.LookupField",
                  allowBlank: true,
                  renderer: NOC.render.Lookup("min_severity"),
                },
                {
                  text: t("btn-max-severity"),
                  dataIndex: "max_severity",
                  width: 200,
                  editor: "fm.alarmseverity.LookupField",
                  allowBlank: true,
                  renderer: NOC.render.Lookup("max_severity"),
                },
                {
                  text: t("header-status"),
                  dataIndex: "status",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      [0, "UNKNOWN"],
                      [1, "UP"],
                      [2, "SLIGHTLY_DEGRADED"],
                      [3, "DEGRADED"],
                      [4, "DOWN"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    0: "UNKNOWN",
                    1: "UP",
                    2: "SLIGHTLY_DEGRADED",
                    3: "DEGRADED",
                    4: "DOWN",
                  }),
                },

              ],
            },
          ],
        },
        {
          name: "diagnostic_status",
          fieldLabel: t("label-diagnostics-config"),
          xtype: "gridfield",
          allowBlank: true,
          //width: 350,
          columns: [
            {
              text: t("header-diagnostic"),
              dataIndex: "diagnostic",
              width: 100,
              editor: "textfield",
              allowBlank: true,
            },
            {
              text: t("msg-by-instance"),
              dataIndex: "instance_checks",
              width: 70,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              editor: "stringlistfield",
              dataIndex: "ctx",
              width: 400,
              text: t("label-context"),
            },
            {
              text: t("app-title-handler"),
              dataIndex: "handler",
              renderer: NOC.render.Lookup("handler"),
              width: 250,
              editor: {
                xtype: "main.handler.LookupField",
                query: {
                  "allow_diagnostics_checks": true,
                },
              },
            },
            {
              text: t("header-failed-status"),
              dataIndex: "failed_status",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  [0, "UNKNOWN"],
                  [1, "UP"],
                  [2, "SLIGHTLY_DEGRADED"],
                  [3, "DEGRADED"],
                  [4, "DOWN"],
                ],
              },
              renderer: NOC.render.Choices({
                0: "UNKNOWN",
                1: "UP",
                2: "SLIGHTLY_DEGRADED",
                3: "DEGRADED",
                4: "DOWN",
              }),
            },
            {
              dataIndex: "alarm_class",
              editor: "fm.alarmclass.LookupField",
              renderer: NOC.render.Lookup("alarm_class"),
              text: t("app-title-alarmclass"),
              width: 200,
              allowBlank: true,
            },
            {
              text: t("msg-alarm-subject"),
              dataIndex: "alarm_subject",
              width: 100,
              editor: "textfield",
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-instance-policy"),
          items: [
            {
              name: "instance_policy",
              xtype: "combobox",
              fieldLabel: t("label-resource-map-policy"),
              tooltip: t("help-how-bind-resources-to-service-instance-br-d-disable-br-a-allowed"),
              store: [
                ["D", t("status-disable")],
                ["A", t("msg-allowed-any")],
                ["C", t("msg-by-config")],
              ],
              allowBlank: true,
              value: "A",
              uiStyle: "medium",
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              name: "instance_settings",
              fieldLabel: t("label-instance-configs"),
              xtype: "gridfield",
              allowBlank: true,
              //width: 350,
              columns: [
                {
                  text: t("btn-instance-type"),
                  dataIndex: "instance_type",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["endpoint", "Endpoint"],
                      ["network", "Network"],
                      ["asset", "Asset"],
                      ["other", "Other"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "endpoint": "L3 Endpoint",
                    "network": "Network",
                    "asset": "Asset",
                    "other": "Other",
                  }),
                },
                {
                  text: t("btn-allow-resources"),
                  dataIndex: "allow_resources",
                  width: 100,
                  editor: {
                    xtype: "tagfield",
                    store: [
                      ["if", "Interface"],
                      ["si", "Subinterface"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "if": "Interface",
                    "si": "Subinterface",
                  }),
                },
                {
                  text: t("header-allow-manual"),
                  dataIndex: "allow_manual",
                  width: 70,
                  editor: "checkbox",
                  renderer: NOC.render.Bool,
                },
                {
                  text: t("btn-send-approve-to-res"),
                  dataIndex: "send_approve",
                  width: 70,
                  editor: "checkbox",
                  renderer: NOC.render.Bool,
                },
                {
                  text: t("btn-only-one-instance"),
                  dataIndex: "only_one_instance",
                  width: 70,
                  editor: "checkbox",
                  renderer: NOC.render.Bool,
                },
                {
                  text: t("btn-allow-register"),
                  dataIndex: "allow_register",
                  width: 70,
                  editor: "checkbox",
                  renderer: NOC.render.Bool,
                },
                {
                  text: t("header-network"),
                  dataIndex: "network_type",
                  width: 70,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["A", "Access"],
                      ["P", "Peer"],
                      ["E", "Enhanced"],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "A": "Access",
                    "N": "Network",
                    "E": "Enhanced",
                  }),
                },
                {
                  text: t("header-ttl"),
                  dataIndex: "ttl",
                  width: 50,
                  editor: {
                    xtype: "numberfield",
                    minValue: 0,
                  },
                },
                {
                  text: t("header-name"),
                  dataIndex: "name",
                  width: 100,
                  editor: "textfield",
                  allowBlank: true,
                },
                {
                  text: t("btn-ref-source"),
                  dataIndex: "refs_caps",
                  renderer: NOC.render.Lookup("refs_caps"),
                  width: 200,
                  editor: "inv.capability.LookupField",
                },
                {
                  text: t("btn-asset-group"),
                  dataIndex: "asset_group",
                  renderer: NOC.render.Lookup("asset_group"),
                  width: 250,
                  editor: {
                    xtype: "inv.resourcegroup.LookupField",
                  },
                },
              ],
            },
          ],
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
              name: "raise_status_alarm_policy",
              xtype: "combobox",
              fieldLabel: t("label-status-alarm-policy"),
              store: [
                ["D", t("status-disable")],
                ["R", t("msg-root-group-only-root-severvice")],
                ["G", t("header-group")],
                ["A", t("msg-direct-alarm")],
              ],
              value: "R",
              uiStyle: "medium",
            },
            {
              name: "raise_alarm_class",
              xtype: "fm.alarmclass.LookupField",
              fieldLabel: t("app-title-alarmclass"),
              uiStyle: "medium",
              allowBlank: true,
            },

          ],
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
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          uiStyle: "extra",
          query: {
            "allow_models": ["sa.ServiceProfile", "sa.Service"],
          },
        },
      ],
    });
    me.callParent();
  },
});
