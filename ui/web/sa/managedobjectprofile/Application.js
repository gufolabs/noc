//---------------------------------------------------------------------
// sa.managedobjectprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobjectprofile.Application");

Ext.define("NOC.sa.managedobjectprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.sa.managedobjectprofile.Model",
    "NOC.sa.managedobjectprofile.LookupField",
    "NOC.sa.authprofile.LookupField",
    "NOC.sa.capsprofile.LookupField",
    "NOC.peer.peerprofile.LookupField",
    "NOC.main.style.LookupField",
    "NOC.main.glyph.LookupField",
    "NOC.main.ref.windowfunction.LookupField",
    "NOC.pm.metrictype.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.ip.prefixprofile.LookupField",
    "NOC.ip.addressprofile.LookupField",
    "NOC.vc.vpnprofile.LookupField",
    "NOC.vc.vlanfilter.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.extstorage.LookupField",
    "NOC.main.handler.LookupField",
    "NOC.inv.ifdescpatterns.LookupField",
    "NOC.cm.objectvalidationpolicy.LookupField",
    "NOC.main.glyph.LookupField",
    "NOC.main.ref.soposition.LookupField",
    "NOC.main.ref.soform.LookupField",
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.core.tagfield.Tagfield",
    "Ext.ux.form.MultiIntervalField",
    "Ext.ux.form.GridField",
    "NOC.wf.workflow.LookupField",
  ],
  model: "NOC.sa.managedobjectprofile.Model",
  search: true,
  helpId: "reference-managed-object-profile",
  rowClassField: "row_class",
  validationModelId: "sa.ManagedObjectProfile",
  viewModel: {
    data: {
      enableBoxDiscoveryVersion: false,
      enableBoxDiscoveryConfig: false,
      enableBoxDiscoveryCaps: false,
      enableBoxDiscoveryInterface: false,
      enableBoxDiscoveryBGPPeer: false,
      enableBoxDiscoveryVLAN: false,
      enableBoxDiscoveryVPNInterface: false,
      enableBoxDiscoveryVPNMPLS: false,
      enableBoxDiscoveryVPNConfDB: false,
      enableBoxDiscoveryPrefixInterface: false,
      enableBoxDiscoveryPrefixNeighbor: false,
      enableBoxDiscoveryPrefixConfDB: false,
      enableBoxDiscoveryAddressInterface: false,
      enableBoxDiscoveryAddressManagement: false,
      enableBoxDiscoveryAddressDHCP: false,
      enableBoxDiscoveryAddressNeighbor: false,
      enableBoxDiscoveryAddressConfDB: false,
      enableBoxDiscoveryHK: false,
      enableBoxDiscoveryNRIPortmap: false,
      enableBoxDiscoveryIfDesc: false,
      enableFMRCADownlinkMerge: false,
    },
    formulas: {
      disableConfigMirrorPolicy: {
        bind: {
          bindTo: "{mirrorPolicy.selection}",
          deep: true,
        },
        get: function(record){
          return record ? this.data.enableBoxDiscoveryConfig.checked
                        && record.get("id") === "D" : true;
        },
      },
      disableConfigPolicy: {
        bind: {
          bindTo: "{configPolicy.selection}",
          deep: true,
        },
        get: function(record){
          return record ? this.data.enableBoxDiscoveryConfig.checked
                        && (record.get("id") === "s") : true;
        },
      },
      disableBeefPolicy: {
        bind: {
          bindTo: "{beefPolicy.selection}",
          deep: true,
        },
        get: function(record){
          return record ? record.get("id") === "D" : true;
        },
      },
    },
  },

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
        },
        {
          text: t("header-level"),
          dataIndex: "level",
          width: 60,
          align: "right",
        },
        {
          text: t("header-ping"),
          dataIndex: "enable_ping",
          width: 100,
          renderer: function(value, meta, record){
            var v = NOC.render.Bool(value);
            if(value){
              v += " " + NOC.render.Duration(record.get("ping_interval"));
              if(record.get("report_ping_rtt")){
                v += "+RTT"
              }
            }
            return v
          },
          align: "center",
        },
        {
          text: t("header-box-discovery"),
          dataIndex: "enable_box_discovery",
          width: 100,
          renderer: function(value, meta, record){
            var v = NOC.render.Bool(value);
            if(value){
              v += " " + NOC.render.Duration(record.get("box_discovery_interval"));
            }
            return v
          },
          align: "center",
        },
        {
          text: t("header-failed-interval"),
          dataIndex: "box_discovery_failed_interval",
          width: 100,
          renderer: NOC.render.Duration,
          align: "center",
        },
        {
          text: t("header-periodic-discovery"),
          dataIndex: "enable_periodic_discovery",
          width: 100,
          renderer: function(value, meta, record){
            var v = NOC.render.Bool(value);
            if(value){
              v += " " + NOC.render.Duration(record.get("periodic_discovery_interval"));
            }
            return v
          },
          align: "center",
        },
        {
          text: t("header-objects-72a83a"),
          dataIndex: "mo_count",
          width: 60,
          align: "right",
          sortable: false,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          width: 300,
          sortable: false,
          renderer: function(value, meta){
            meta.tdAttr = 'data-qtip="' + value + '"';
            return value
          },
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          autoFocus: true,
          allowBlank: false,
        },
        {
          xtype: "tabpanel",
          layout: "fit",
          autoScroll: true,
          tabPosition: "left",
          tabBar: {
            tabRotation: 0,
            layout: {
              align: "stretch",
            },
          },
          anchor: "-0, -50",
          defaults: {
            autoScroll: true,
            layout: "anchor",
            textAlign: "left",
            padding: 10,
          },
          items: [
            {
              title: t("app-title-common"),
              items: [
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  allowBlank: true,
                  uiStyle: "extra",
                },
                {
                  name: "level",
                  xtype: "numberfield",
                  fieldLabel: t("header-level"),
                  allowBlank: false,
                  uiStyle: "small",
                },
                {
                  name: "labels",
                  xtype: "labelfield",
                  fieldLabel: t("header-labels"),
                  allowBlank: true,
                  uiStyle: "extra",
                  query: {
                    "allow_models": ["sa.ManagedObjectProfile"],
                  },
                },
                {
                  name: "workflow",
                  xtype: "wf.workflow.LookupField",
                  fieldLabel: t("label-workflow"),
                  uiStyle: "medium",
                  allowBlank: true,
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-display-settings"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "style",
                          xtype: "main.style.LookupField",
                          fieldLabel: t("app-title-style"),
                          allowBlank: true,
                        },
                        {
                          name: "glyph",
                          xtype: "main.glyph.LookupField",
                          fieldLabel: t("app-title-glyph"),
                          allowBlank: true,
                        },
                        {
                          name: "shape_title_template",
                          xtype: "textfield",
                          fieldLabel: t("label-shape-name-template"),
                          allowBlank: true,
                          uiStyle: "large",
                        },
                      ],
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-badge"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "shape_overlay_glyph",
                          xtype: "main.glyph.LookupField",
                          fieldLabel: t("app-title-glyph"),
                          allowBlank: true,
                        },
                        {
                          name: "shape_overlay_position",
                          xtype: "main.ref.soposition.LookupField",
                          fieldLabel: t("label-position"),
                          allowBlank: true,
                        },
                        {
                          name: "shape_overlay_form",
                          xtype: "main.ref.soform.LookupField",
                          fieldLabel: t("label-form"),
                          allowBlank: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-integration"),
                  tooltip: t("help-field-on-this-use-in-etl-process-sync-on-external-system-br-do-n"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "remote_system",
                          xtype: "main.remotesystem.LookupField",
                          labelWidth: 150,
                          fieldLabel: t("app-title-remotesystem"),
                          allowBlank: true,
                        },
                        {
                          name: "remote_id",
                          xtype: "textfield",
                          labelWidth: 150,
                          fieldLabel: t("label-remote-id"),
                          allowBlank: true,
                          uiStyle: "medium",
                        },
                        {
                          name: "bi_id",
                          xtype: "displayfield",
                          labelWidth: 150,
                          fieldLabel: t("label-bi-id"),
                          allowBlank: true,
                          uiStyle: "medium",
                        },
                      ],

                    },
                  ],
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  xtype: "fieldset",
                  title: t("label-address-resolution-policy"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "address_resolution_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-address-resolution-policy"),
                      store: [
                        ["D", t("msg-disabled")],
                        ["O", t("msg-once")],
                        ["E", t("header-enabled")],
                      ],
                      allowBlank: false,
                      labelWidth: 200,
                      value: "D",
                      uiStyle: "large",
                    },
                    {
                      name: "resolver_handler",
                      xtype: "main.handler.LookupField",
                      fieldLabel: t("label-resolver-handler"),
                      allowBlank: true,
                      uiStyle: "medium",
                      query: {
                        allow_resolver: true,
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ipam-field"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "name_template",
                      xtype: "textfield",
                      fieldLabel: t("label-name-template-2"),
                      allowBlank: true,
                      uiStyle: "large",
                    },
                    {
                      name: "fqdn_suffix",
                      xtype: "textfield",
                      fieldLabel: t("label-fqdn-suffix"),
                      allowBlank: true,
                      uiStyle: "large",
                    },
                  ],
                },
                {
                  name: "dynamic_classification_policy",
                  xtype: "combobox",
                  fieldLabel: t("label-dynamic-classification-policy"),
                  store: [
                    ["D", t("msg-disabled")],
                    ["R", t("msg-by-rule")],
                  ],
                  allowBlank: false,
                  labelWidth: 200,
                  value: "R",
                  uiStyle: "medium",
                },
                {
                  name: "match_rules",
                  xtype: "listform",
                  rows: 6,
                  labelAlign: "top",
                  uiStyle: "large",
                  fieldLabel: t("label-match-rules"),
                  items: [
                    {
                      name: "dynamic_order",
                      xtype: "numberfield",
                      fieldLabel: t("label-dynamic-order"),
                      allowBlank: true,
                      defaultValue: 0,
                      minValue: 0,
                      uiStyle: "small",
                    },
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
                      xtype: "core.tagfield",
                      url: "/inv/resourcegroup/lookup/",
                      fieldLabel: t("label-object-groups"),
                      name: "resource_groups",
                      allowBlank: true,
                      uiStyle: "extra",
                    },
                  ],
                },
              ],
            },
            {
              title: t("label-access"),
              tooltip: t("help-worked-with-devices-settings"),
              items: [
                {
                  name: "access_preference",
                  xtype: "combobox",
                  tooltip: t("help-protocol-priority-worked-on-device-br-warning-device-profile-sa-"),
                  fieldLabel: t("label-access-preference"),
                  labelWidth: 220,
                  allowBlank: true,
                  uiStyle: "medium",
                  store: [
                    ["S", t("msg-snmp-only")],
                    ["C", t("msg-cli-only")],
                    ["SC", t("msg-snmp-cli")],
                    ["CS", t("msg-cli-snmp")],
                  ],
                  value: "CS",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "cli_session_policy",
                  xtype: "combobox",
                  tooltip: t("help-use-one-session-worked-on-device-br-if-disabled-worked-one-scrip"),
                  fieldLabel: t("label-cli-session-policy"),
                  labelWidth: 220,
                  allowBlank: true,
                  labelAlign: "left",
                  uiStyle: "medium",
                  store: [
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  value: "E",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "cli_privilege_policy",
                  xtype: "combobox",
                  tooltip: t("help-do-enable-if-login-unprivileged-mode-on-device-br-raise-privileg-2"),
                  fieldLabel: t("label-cli-privilege-policy"),
                  labelWidth: 220,
                  allowBlank: true,
                  uiStyle: "medium",
                  store: [
                    ["D", t("msg-do-not-raise")],
                    ["E", t("msg-raise-privileges")],
                  ],
                  value: "E",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "snmp_rate_limit",
                  xtype: "numberfield",
                  fieldLabel: t("label-snmp-rate-limit"),
                  labelWidth: 220,
                  tooltip: t("help-limit-snmp-query-per-second"),
                  uiStyle: "small",
                  allowBlank: true,
                  minValue: 0,
                  maxValue: 99,
                  listeners: {
                    render: me.addTooltip,
                  },
                },
              ],
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              title: t("btn-card"),
              items: [
                {
                  name: "card",
                  xtype: "textfield",
                  fieldLabel: t("btn-card"),
                  labelWidth: 200,
                  allowBlank: true,
                  uiStyle: "extra",
                },
                {
                  name: "card_title_template",
                  xtype: "textfield",
                  fieldLabel: t("label-card-title-template"),
                  labelWidth: 200,
                  allowBlank: false,
                  uiStyle: "extra",
                },
              ],
            },
            {
              title: t("app-title-ping-check"),
              items: [
                {
                  name: "enable_ping",
                  xtype: "checkboxfield",
                  boxLabel: t("label-enable"),
                  allowBlank: false,

                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ping-discovery-intervals"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "ping_interval",
                          xtype: "numberfield",
                          fieldLabel: t("label-interval-sec"),
                          uiStyle: "small",
                          minValue: 0,
                          listeners: {
                            scope: me,
                            change: function(_item, newValue){
                              me.form.findField("ping_calculated").setValue(newValue);
                            },
                          },
                        },
                        {
                          name: "ping_calculated",
                          xtype: "displayfield",
                          renderer: NOC.render.Duration,
                        },
                        {
                          name: "ping_time_expr_policy",
                          xtype: "combobox",
                          tooltip: t("help-enable-or-disable-ping-if-working-hour-on-object-is-set-br-enabl"),
                          fieldLabel: t("label-policy-off-hours"),
                          labelWidth: 120,
                          allowBlank: true,
                          uiStyle: "medium",
                          store: [
                            ["D", t("choice-disable-ping")],
                            ["E", t("btn-enable-ping-but-don-t-follow-status")],
                          ],
                          value: "D",
                          listeners: {
                            render: me.addTooltip,
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ping-series-settings"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "ping_policy",
                      xtype: "combobox",
                      labelAlign: "left",
                      labelWidth: 220,
                      fieldLabel: t("label-ping-policy"),
                      allowBlank: true,
                      uiStyle: "medium",
                      store: [
                        ["f", t("msg-first-success")],
                        ["a", t("msg-all-success")],
                      ],
                      value: "f",
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "ping_size",
                          xtype: "numberfield",
                          fieldLabel: t("label-packet-size-bytes"),
                          labelWidth: 220,
                          uiStyle: "small",
                          defaultValue: 64,
                          minValue: 64,
                        },
                      ],
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "ping_count",
                          xtype: "numberfield",
                          fieldLabel: t("label-packets-count"),
                          labelWidth: 220,
                          defaultValue: 3,
                          minValue: 0,
                          uiStyle: "small",
                        },
                      ],
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "ping_timeout_ms",
                          xtype: "numberfield",
                          fieldLabel: t("label-timeout-msec"),
                          defaultValue: 1000,
                          minValue: 0,
                          labelWidth: 220,
                          uiStyle: "small",
                          listeners: {
                            scope: me,
                            change: function(_item, newValue){
                              me.form.findField("ping_tm_calculated").setValue(newValue / 1000);
                            },
                          },
                        },
                        {
                          name: "ping_tm_calculated",
                          xtype: "displayfield",
                          renderer: NOC.render.Duration,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "report_ping_rtt",
                  xtype: "checkboxfield",
                  boxLabel: t("label-report-ping-rtt"),
                  allowBlank: false,
                },
                {
                  name: "report_ping_attempts",
                  xtype: "checkboxfield",
                  boxLabel: t("label-report-ping-attempts"),
                  allowBlank: false,
                },
              ],
            },
            {
              title: "FM",
              items: [
                {
                  name: "event_processing_policy",
                  xtype: "combobox",
                  tooltip: t("help-processed-syslog-snmp-trap-message-to-classifier-service-br-e-se"),
                  labelWidth: 150,
                  fieldLabel: t("label-event-policy"),
                  store: [
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  value: "E",
                  allowBlank: true,
                  uiStyle: "medium",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "weight",
                  xtype: "numberfield",
                  labelWidth: 150,
                  fieldLabel: t("label-alarm-weight-2"),
                  allowBlank: false,
                  uiStyle: "small",
                },
                {
                  name: "syslog_archive_policy",
                  xtype: "combobox",
                  tooltip: t("help-enable-send-syslog-message-to-clickhouse-b-syslog-b-table-br-may"),
                  labelWidth: 150,
                  fieldLabel: t("label-syslog-archive-policy"),
                  store: [
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                  ],
                  value: "D",
                  allowBlank: true,
                  uiStyle: "medium",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "escalation_policy",
                  xtype: "combobox",
                  tooltip: t("help-enable-allow-to-escalate-alarm-for-managedobject-br-as-depended-"),
                  labelWidth: 150,
                  fieldLabel: t("label-escalation-policy"),
                  allowBlank: true,
                  uiStyle: "medium",
                  store: [
                    ["E", t("label-enable")],
                    ["D", t("status-disable")],
                    ["R", t("msg-as-depended")],
                  ],
                  value: "E",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-merge-downlinks"),
                  defaults: {
                    padding: 4,
                  },
                  items: [
                    {
                      name: "enable_rca_downlink_merge",
                      xtype: "checkbox",
                      boxLabel: t("label-enable"),
                      reference: "enableFMRCADownlinkMerge",
                    },
                    {
                      name: "rca_downlink_merge_window",
                      xtype: "numberfield",
                      minValue: 0,
                      fieldLabel: t("label-merge-window-sec"),
                      labelWidth: 150,
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableFMRCADownlinkMerge.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-abduct-detection"),
                  defaults: {
                    padding: 4,
                  },
                  items: [
                    {
                      name: "abduct_detection_window",
                      fieldLabel: t("label-abduct-detection-window"),
                      labelWidth: 150,
                      xtype: "numberfield",
                      allowBlank: true,
                      uiStyle: "small",
                    },
                    {
                      name: "abduct_detection_threshold",
                      fieldLabel: t("label-abduct-detection-threshold"),
                      labelWidth: 200,
                      xtype: "numberfield",
                      allowBlank: true,
                      uiStyle: "small",
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-trap-collector-storm-settings"),
                  defaults: {
                    padding: 4,
                  },
                  items: [
                    {
                      name: "trapcollector_storm_policy",
                      xtype: "combobox",
                      tooltip: t("help-check-device-snmp-trap-storm-policy-br-check-trap-message-count-"),
                      labelWidth: 150,
                      fieldLabel: t("label-storm-policy"),
                      store: [
                        ["B", t("msg-block")],
                        ["R", t("msg-raise-alarm")],
                        ["A", t("msg-block-raise-alarm")],
                        ["D", t("status-disable")],
                      ],
                      value: "D",
                      allowBlank: true,
                      uiStyle: "medium",
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "trapcollector_storm_threshold",
                      fieldLabel: t("label-message-storm-threshold"),
                      labelWidth: 200,
                      xtype: "numberfield",
                      allowBlank: true,
                      uiStyle: "small",
                    },
                  ],
                },
              ],
            },
            {
              title: t("header-box-discovery"),
              items: [
                {
                  xtype: "fieldset",
                  layout: "vbox",
                  items: [
                    {
                      name: "enable_box_discovery",
                      xtype: "checkbox",
                      boxLabel: t("label-enable"),
                    },
                    {
                      name: "box_discovery_running_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-running-policy"),
                      store: [
                        ["R", t("choice-require-up")],
                        ["r", t("msg-require-up-if-ping-enabled")],
                        ["i", t("msg-always-run")],
                      ],
                      labelWidth: 250,
                      allowBlank: false,
                      uiStyle: "medium",
                      padding: "0 0 0 8px",
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-box-discovery-intervals"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 4px",
                      },
                      items: [
                        {
                          name: "box_discovery_interval",
                          xtype: "numberfield",
                          fieldLabel: t("label-interval-sec"),
                          labelWidth: 250,
                          allowBlank: false,
                          uiStyle: "small",
                          minValue: 0,
                          listeners: {
                            scope: me,
                            change: function(_item, newValue){
                              me.form.findField("box_discovery_interval_calculated").setValue(newValue);
                            },
                          },
                        },
                        {
                          name: "box_discovery_interval_calculated",
                          xtype: "displayfield",
                          renderer: NOC.render.Duration,
                        },
                      ],
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 4px",
                      },
                      items: [
                        {
                          name: "box_discovery_failed_interval",
                          xtype: "numberfield",
                          fieldLabel: t("label-failed-interval-sec"),
                          labelWidth: 250,
                          minValue: 0,
                          allowBlank: false,
                          uiStyle: "small",
                          listeners: {
                            scope: me,
                            change: function(_item, newValue){
                              me.form.findField("box_discovery_failed_interval_calculated").setValue(newValue);
                            },
                          },
                        },
                        {
                          name: "box_discovery_failed_interval_calculated",
                          xtype: "displayfield",
                          renderer: NOC.render.Duration,
                        },
                      ],
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 4px",
                      },
                      items: [
                        {
                          name: "box_discovery_on_system_start",
                          xtype: "checkbox",
                          width: 243,
                          boxLabel: t("label-check-on-system-start-after"),
                        },
                        {
                          name: "box_discovery_system_start_delay",
                          xtype: "numberfield",
                          labelWidth: -5,
                          minValue: 0,
                          allowBlank: false,
                          uiStyle: "small",
                        },  
                        {
                          name: "_box_discovery_system_start_delay",
                          xtype: "displayfield",
                          value: t("msg-sec"),
                        },
                      ],
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 4px",
                      },
                      items: [
                        {
                          name: "box_discovery_on_config_changed",
                          xtype: "checkbox",
                          width: 243,
                          boxLabel: t("label-check-on-config-change-after"),
                        },
                        {
                          name: "box_discovery_config_changed_delay",
                          xtype: "numberfield",
                          minValue: 0,
                          labelWidth: -5,
                          allowBlank: false,
                          uiStyle: "small",
                        },
                        {
                          name: "_box_discovery_config_changed_delay",
                          xtype: "displayfield",
                          value: t("msg-sec"),
                        },
                      ],
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-box"),
                  layout: {
                    type: "table",
                    columns: 3,
                  },
                  defaults: {
                    padding: "0 8 0 0",
                  },
                  items: [
                    {
                      name: "enable_box_discovery_profile",
                      xtype: "checkboxfield",
                      boxLabel: t("header-profile"),
                      colspan: 3,
                    },
                    {
                      name: "enable_box_discovery_version",
                      xtype: "checkboxfield",
                      boxLabel: t("header-version"),
                      reference: "enableBoxDiscoveryVersion",
                      colspan: 3,
                    },
                    {
                      name: "enable_box_discovery_caps",
                      xtype: "checkboxfield",
                      boxLabel: t("header-caps"),
                      reference: "enableBoxDiscoveryCaps",
                    },
                    {
                      name: "caps_discovery_policy",
                      xtype: "combobox",
                      fieldLabel: t("header-policy"),
                      store: [
                        ["s", t("label-script")],
                        ["S", t("msg-script-confdb")],
                        ["C", t("msg-confdb-script")],
                        ["c", t("msg-confdb")],
                      ],
                      allowBlank: false,
                      bind: {
                        disabled: "{!enableBoxDiscoveryCaps.checked}",
                      },
                      uiStyle: "medium",
                    },
                    {
                      name: "caps_profile",
                      xtype: "sa.capsprofile.LookupField",
                      tooltip: t("help-set-which-caps-will-be-check-in-caps-discovery-br-service-activa"),
                      fieldLabel: t("app-title-capsprofile"),
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryCaps.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "enable_box_discovery_interface",
                      xtype: "checkboxfield",
                      boxLabel: t("header-interface"),
                      reference: "enableBoxDiscoveryInterface",
                    },
                    {
                      name: "interface_discovery_policy",
                      xtype: "combobox",
                      fieldLabel: t("header-policy"),
                      store: [
                        ["s", t("label-script")],
                        ["S", t("msg-script-confdb")],
                        ["C", t("msg-confdb-script")],
                        ["c", t("msg-confdb")],
                      ],
                      allowBlank: false,
                      bind: {
                        disabled: "{!enableBoxDiscoveryInterface.checked}",
                      },
                      uiStyle: "medium",
                    },
                    {
                      name: "enable_interface_autocreation",
                      xtype: "checkbox",
                      boxLabel: t("label-enable-autocreation"),
                      bind: {
                        disabled: "{enableBoxDiscoveryInterface.checked}",
                      },
                    },
                    {
                      name: "enable_box_discovery_id",
                      xtype: "checkboxfield",
                      boxLabel: t("header-id"),
                      colspan: 3,
                    },
                    {
                      name: "enable_box_discovery_config",
                      xtype: "checkboxfield",
                      boxLabel: t("btn-config"),
                      reference: "enableBoxDiscoveryConfig",
                      colspan: 3,
                    },
                    {
                      name: "enable_box_discovery_asset",
                      xtype: "checkboxfield",
                      boxLabel: t("label-asset"),
                      colspan: 3,
                    },
                    {
                      name: "enable_box_discovery_cpe",
                      xtype: "checkboxfield",
                      boxLabel: t("header-cpe"),
                      colspan: 3,
                    },
                    {
                      name: "enable_box_discovery_bgppeer",
                      xtype: "checkboxfield",
                      boxLabel: t("label-bgp-peer"),
                      reference: "enableBoxDiscoveryBGPPeer",
                    },
                    {
                      name: "bgpeer_discovery_policy",
                      xtype: "combobox",
                      fieldLabel: t("header-policy"),
                      store: [
                        ["c", t("msg-confdb")],
                      ],
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryBGPPeer.checked}",
                      },
                      uiStyle: "medium",
                    },
                    {
                      name: "bgppeer_profile",
                      xtype: "peer.peerprofile.LookupField",
                      tooltip: t("help-set-which-peer-profile-will-be-set-when-created-br-peer-setup-pe"),
                      fieldLabel: t("label-bgp-peer-profile"),
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryBGPPeer.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-topology"),
                  layout: "vbox",
                  items: [
                    {
                      xtype: "container",
                      layout: {
                        type: "column",
                        // wrap: true,
                      },
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "enable_box_discovery_nri",
                          xtype: "checkboxfield",
                          boxLabel: t("label-nri"),
                          bind: {
                            disabled: "{!enableBoxDiscoveryNRIPortmap.checked}",
                          },
                        },
                        {
                          name: "enable_box_discovery_bfd",
                          xtype: "checkboxfield",
                          boxLabel: t("label-bfd"),
                        },
                        {
                          name: "enable_box_discovery_cdp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-cdp"),
                        },
                        {
                          name: "enable_box_discovery_huawei_ndp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-huawei-ndp"),
                        },
                        {
                          name: "enable_box_discovery_mikrotik_ndp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-mikrotik-ndp"),
                        },
                        {
                          name: "enable_box_discovery_fdp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-fdp"),
                        },
                        {
                          name: "enable_box_discovery_lldp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-lldp"),
                        },
                        {
                          name: "enable_box_discovery_oam",
                          xtype: "checkboxfield",
                          boxLabel: t("label-oam"),
                        },
                        {
                          name: "enable_box_discovery_rep",
                          xtype: "checkboxfield",
                          boxLabel: t("label-rep"),
                        },
                        {
                          name: "enable_box_discovery_stp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-stp"),
                        },
                        {
                          name: "enable_box_discovery_udld",
                          xtype: "checkboxfield",
                          boxLabel: t("label-udld"),
                        },
                        {
                          name: "enable_box_discovery_lacp",
                          xtype: "checkboxfield",
                          boxLabel: t("label-lacp"),
                        },
                        {
                          name: "enable_box_discovery_xmac",
                          xtype: "checkboxfield",
                          boxLabel: t("label-xmac"),
                        },
                        {
                          name: "enable_box_discovery_ifdesc",
                          xtype: "checkboxfield",
                          boxLabel: t("label-ifdesc"),
                          reference: "enableBoxDiscoveryIfDesc",
                        },
                      ],
                    },
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "neighbor_cache_ttl",
                          xtype: "numberfield",
                          tooltip: t("help-cache-neighbors-get-x-neighbors-script-result-br-when-informatio"),
                          fieldLabel: t("label-cache-neighbors-for"),
                          allowBlank: false,
                          labelWidth: 250,
                          minValue: 0,
                          uiStyle: "small",
                          align: "right",
                          listeners: {
                            render: me.addTooltip,
                          },
                        },
                        {
                          xtype: "displayfield",
                          name: "_neighbor_cache_ttl",
                          value: t("msg-sec"),
                        },
                      ],
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ifdesc-policy"),
                  layout: "hbox",
                  defaults: {
                    padding: 4,
                    labelAlign: "right",
                  },
                  items: [
                    {
                      name: "ifdesc_symmetric",
                      xtype: "checkbox",
                      boxLabel: t("label-symmetric-check"),
                      bind: {
                        disabled: "{!enableBoxDiscoveryIfDesc.checked}",
                      },
                    },
                    {
                      name: "ifdesc_patterns",
                      xtype: "inv.ifdescpatterns.LookupField",
                      fieldLabel: t("label-patterns"),
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryIfDesc.checked}",
                      },
                    },
                    {
                      name: "ifdesc_handler",
                      xtype: "main.handler.LookupField",
                      fieldLabel: t("app-title-handler"),
                      allowBlank: true,
                      query: {
                        allow_ifdesc: true,
                      },
                      bind: {
                        disabled: "{!enableBoxDiscoveryIfDesc.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-platform-version"),
                  items: [
                    {
                      name: "new_platform_creation_policy",
                      xtype: "combobox",
                      tooltip: t("help-action-when-discovery-new-platform-on-version-discovery-br-creat"),
                      fieldLabel: t("label-on-new-platform"),
                      labelWidth: 250,
                      store: [
                        ["C", t("app-title-create")],
                        ["A", t("app-title-alarm")],
                      ],
                      uiStyle: "medium",
                      allowBlank: false,
                      bind: {
                        disabled: "{!enableBoxDiscoveryVersion.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "denied_firmware_policy",
                      xtype: "combobox",
                      tooltip: t("help-action-when-discovery-firmware-denied-on-firmwarepolice-inventor"),
                      fieldLabel: t("label-on-denied-firmware"),
                      store: [
                        ["I", t("choice-ignore")],
                        ["s", t("msg-ignore-stop")],
                        ["A", t("msg-raise-alarm")],
                        ["S", t("msg-raise-alarm-stop")],
                      ],
                      labelWidth: 250,
                      uiStyle: "medium",
                      allowBlank: false,
                      bind: {
                        disabled: "{!enableBoxDiscoveryVersion.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-vlan"),
                  layout: {
                    type: "table",
                    columns: 3,
                  },
                  defaults: {
                    padding: "2px 4px 2px 4px",
                  },
                  items: [
                    {
                      xtype: "label",
                      text: t("header-source"),
                    },
                    {
                      xtype: "label",
                      text: t("label-enable"),
                    },
                    {
                      xtype: "label",
                      text: t("header-policy"),
                    },
                    {
                      xtype: "label",
                      text: t("header-interface"),
                    },
                    {
                      name: "vlan_interface_discovery",
                      xtype: "combobox",
                      store: [
                        ["D", t("status-disable")],
                        ["S", t("msg-state-only")],
                        ["V", t("msg-vlan-sync")],
                      ],
                      allowBlank: true,
                      uiStyle: "medium",
                    },
                    {
                    },
                    {
                      xtype: "label",
                      text: t("btn-vlan-db"),
                    },
                    {
                      name: "vlan_vlandb_discovery",
                      xtype: "combobox",
                      store: [
                        ["D", t("status-disable")],
                        ["S", t("msg-state-only")],
                        ["V", t("msg-vlan-sync")],
                      ],
                      allowBlank: true,
                      uiStyle: "medium",
                    },
                    {
                      name: "vlan_discovery_policy",
                      xtype: "combobox",
                      store: [
                        ["s", t("label-script")],
                        ["S", t("msg-script-confdb")],
                        ["C", t("msg-confdb-script")],
                        ["c", t("msg-confdb")],
                      ],
                      allowBlank: false,
                      uiStyle: "medium",
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ipam-vpn"),
                  layout: {
                    type: "table",
                    columns: 3,
                  },
                  defaults: {
                    padding: "2px 4px 2px 4px",
                  },
                  items: [
                    {
                      xtype: "label",
                      text: t("header-type"),
                    },
                    {
                      xtype: "label",
                      text: t("label-enable"),
                    },
                    {
                      xtype: "label",
                      text: t("msg-vpn-profile"),
                    },
                    {
                      xtype: "label",
                      text: t("header-interface"),
                    },
                    {
                      name: "enable_box_discovery_vpn_interface",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryVPNInterface",
                    },
                    {
                      name: "vpn_profile_interface",
                      xtype: "vc.vpnprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryVPNInterface.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("btn-mpls"),
                    },
                    {
                      name: "enable_box_discovery_vpn_mpls",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryVPNMPLS",
                    },
                    {
                      name: "vpn_profile_mpls",
                      xtype: "vc.vpnprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryVPNMPLS.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("msg-confdb"),
                    },
                    {
                      name: "enable_box_discovery_vpn_confdb",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryVPNConfDB",
                    },
                    {
                      name: "vpn_profile_confdb",
                      xtype: "vc.vpnprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryVPNConfDB.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ipam-prefix"),
                  layout: {
                    type: "table",
                    columns: 3,
                  },
                  defaults: {
                    padding: "2px 4px 2px 4px",
                  },
                  items: [
                    {
                      xtype: "label",
                      text: t("header-type"),
                    },
                    {
                      xtype: "label",
                      text: t("label-enable"),
                    },
                    {
                      xtype: "label",
                      text: t("app-title-prefixprofile"),
                    },
                    {
                      xtype: "label",
                      text: t("header-interface"),
                    },
                    {
                      name: "enable_box_discovery_prefix_interface",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryPrefixInterface",
                    },
                    {
                      name: "prefix_profile_interface",
                      xtype: "ip.prefixprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryPrefixInterface.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("header-neighbor"),
                    },
                    {
                      name: "enable_box_discovery_prefix_neighbor",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryPrefixNeighbor",
                    },
                    {
                      name: "prefix_profile_neighbor",
                      xtype: "ip.prefixprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryPrefixNeighbor.checked}",
                      },

                    },
                    {
                      xtype: "label",
                      text: t("msg-confdb"),
                    },
                    {
                      name: "enable_box_discovery_prefix_confdb",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryPrefixConfDB",
                    },
                    {
                      name: "prefix_profile_confdb",
                      xtype: "ip.prefixprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryPrefixConfDB.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-ipam-address"),
                  layout: {
                    type: "table",
                    columns: 3,
                  },
                  defaults: {
                    padding: "2px 4px 2px 4px",
                  },
                  items: [
                    {
                      xtype: "label",
                      text: t("header-type"),
                    },
                    {
                      xtype: "label",
                      text: t("label-enable"),
                    },
                    {
                      xtype: "label",
                      text: t("app-title-addressprofile"),
                    },
                    {
                      xtype: "label",
                      text: t("header-interface"),
                    },
                    {
                      name: "enable_box_discovery_address_interface",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryAddressInterface",
                    },
                    {
                      name: "address_profile_interface",
                      xtype: "ip.addressprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryAddressInterface.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("header-management"),
                    },
                    {
                      name: "enable_box_discovery_address_management",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryAddressManagement",
                    },
                    {
                      name: "address_profile_management",
                      xtype: "ip.addressprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryAddressManagement.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("btn-dhcp"),
                    },
                    {
                      name: "enable_box_discovery_address_dhcp",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryAddressDHCP",
                    },
                    {
                      name: "address_profile_dhcp",
                      xtype: "ip.addressprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryAddressDHCP.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("header-neighbor"),
                    },
                    {
                      name: "enable_box_discovery_address_neighbor",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryAddressNeighbor",
                    },
                    {
                      name: "address_profile_neighbor",
                      xtype: "ip.addressprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryAddressNeighbor.checked}",
                      },
                    },
                    {
                      xtype: "label",
                      text: t("msg-confdb"),
                    },
                    {
                      name: "enable_box_discovery_address_confdb",
                      xtype: "checkbox",
                      reference: "enableBoxDiscoveryAddressConfDB",
                    },
                    {
                      name: "address_profile_confdb",
                      xtype: "ip.addressprofile.LookupField",
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryAddressConfDB.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-clear-links"),
                  layout: "hbox",
                  defaults: {
                    padding: "0 8 0 0",
                  },
                  items: [
                    {
                      name: "clear_links_on_platform_change",
                      xtype: "checkboxfield",
                      boxLabel: t("label-on-platform-change"),
                    },
                    /* Not implemented yet
                                        {
                                            name: "clear_links_on_serial_change",
                                            xtype: "checkboxfield",
                                            boxLabel: t("On serial change")
                                        } */
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-group-sla"),
                  layout: "hbox",
                  defaults: {
                    padding: "0 8 0 0",
                  },
                  items: [
                    {
                      name: "enable_box_discovery_sla",
                      xtype: "checkboxfield",
                      boxLabel: t("app-group-sla"),
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("label-nri"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "enable_box_discovery_nri_portmap",
                      xtype: "checkboxfield",
                      boxLabel: t("label-portmapper"),
                      reference: "enableBoxDiscoveryNRIPortmap",
                    },
                    {
                      name: "enable_box_discovery_nri_service",
                      xtype: "checkboxfield",
                      boxLabel: t("label-service-binding"),
                      bind: {
                        disabled: "{!enableBoxDiscoveryNRIPortmap.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-housekeeping"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "enable_box_discovery_hk",
                      xtype: "checkboxfield",
                      boxLabel: t("app-title-housekeeping"),
                      reference: "enableBoxDiscoveryHK",
                    },
                    {
                      name: "hk_handler",
                      xtype: "main.handler.LookupField",
                      fieldLabel: t("app-title-handler"),
                      allowBlank: true,
                      uiStyle: "medium",
                      query: {
                        allow_housekeeping: true,
                      },
                      bind: {
                        disabled: "{!enableBoxDiscoveryHK.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-discovery-alarm"),
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "box_discovery_alarm_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-box-alarm"),
                      allowBlank: true,
                      labelWidth: 150,
                      labelAlign: "left",
                      uiStyle: "small",
                      store: [
                        ["E", t("label-enable")],
                        ["D", t("status-disable")],
                      ],
                      value: "D",
                    },
                    {
                      name: "box_discovery_fatal_alarm_weight",
                      xtype: "numberfield",
                      fieldLabel: t("label-fatal-alarm-weight"),
                      labelWidth: 150,
                      labelAlign: "left",
                      allowBlank: true,
                      minValue: 0,
                      uiStyle: "small",
                    },
                    {
                      name: "box_discovery_alarm_weight",
                      xtype: "numberfield",
                      fieldLabel: t("label-alarm-weight-2"),
                      labelWidth: 150,
                      labelAlign: "left",
                      allowBlank: true,
                      minValue: 0,
                      uiStyle: "small",
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-process-telemetry"),
                  defaults: {
                    labelAlign: "left",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "box_discovery_telemetry_sample",
                      xtype: "numberfield",
                      tooltip: t("help-sampling-value-for-box-discovery-interval-from-0-to-1-br-1-all-j"),
                      labelWidth: 150,
                      minValue: 0,
                      maxValue: 1,
                      fieldLabel: t("label-box-sample"),
                      allowBlank: true,
                      uiStyle: "small",
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
              ],
            },
            {
              title: t("header-periodic-discovery"),
              items: [
                {
                  xtype: "container",
                  layout: "hbox",
                  items: [
                    {
                      name: "enable_periodic_discovery",
                      xtype: "checkbox",
                      boxLabel: t("label-enable"),
                    },
                    {
                      name: "periodic_discovery_running_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-running-policy"),
                      store: [
                        ["R", t("choice-require-up")],
                        ["r", t("msg-require-up-if-ping-enabled")],
                        ["i", t("msg-always-run")],
                      ],
                      allowBlank: false,
                      uiStyle: "medium",
                      padding: "0 0 0 4px",
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-periodic-discovery-intervals"),
                  layout: "vbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      xtype: "container",
                      layout: "hbox",
                      defaults: {
                        padding: "0 8 0 0",
                      },
                      items: [
                        {
                          name: "periodic_discovery_interval",
                          xtype: "numberfield",
                          fieldLabel: t("label-interval-sec"),
                          allowBlank: false,
                          uiStyle: "small",
                          minValue: 0,
                          listeners: {
                            scope: me,
                            change: function(_item, newValue){
                              me.form.findField("periodic_discovery_interval_calculated").setValue(newValue);
                            },
                          },
                        },
                        {
                          name: "periodic_discovery_interval_calculated",
                          xtype: "displayfield",
                          renderer: NOC.render.Duration,
                        },
                      ],
                    },
                  ],
                },
                {
                  xtype: "container",
                  layout: {
                    type: "table",
                    columns: 3,
                  },
                  defaults: {
                    padding: "4 8 0 0",
                  },
                  items: [
                    {
                      name: "enable_periodic_discovery_uptime",
                      xtype: "checkboxfield",
                      boxLabel: t("label-uptime"),
                      colspan: 2,
                    },
                    {
                      name: "periodic_discovery_uptime_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-interval-sec"),
                      uiStyle: "small",
                      minValue: 0,
                    },
                    {
                      name: "enable_periodic_discovery_interface_status",
                      xtype: "checkboxfield",
                      boxLabel: t("label-interface-status"),
                      colspan: 2,
                    },
                    {
                      name: "periodic_discovery_interface_status_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-interval-sec"),
                      uiStyle: "small",
                      minValue: 0,
                    },
                    {
                      name: "enable_periodic_discovery_mac",
                      xtype: "checkboxfield",
                      boxLabel: t("header-mac"),
                      reference: "enablePeriodicDiscoveryMAC",
                      colspan: 3,
                    },
                    {
                      name: "periodic_discovery_mac_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-interval-sec"),
                      uiStyle: "small",
                      minValue: 0,
                    },
                    {
                      name: "periodic_discovery_mac_filter_policy",
                      xtype: "combobox",
                      fieldLabel: t("header-policy"),
                      store: [
                        ["A", t("choice-all")],
                        ["I", t("app-title-interfaceprofile")],
                      ],
                      tooltip: t("help-i-collect-macs-only-for-allowed-interfaces-br-mac-discovery-poli") +
                                            "A - Collect All MACs",
                      allowBlank: false,
                      bind: {
                        disabled: "{!enablePeriodicDiscoveryMAC.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                      uiStyle: "medium",
                    },
                    {
                      name: "mac_collect_vlanfilter",
                      xtype: "vc.vlanfilter.LookupField",
                      tooltip: t("help-set-which-caps-will-be-check-in-caps-discovery-br-vc-setup-vlan-"),
                      fieldLabel: t("app-title-vlanfilter"),
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryMAC.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "enable_periodic_discovery_alarms",
                      xtype: "checkboxfield",
                      boxLabel: t("header-alarms"),
                      colspan: 2,
                    },
                    {
                      name: "periodic_discovery_alarms_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-interval-sec-2"),
                      uiStyle: "small",
                      minValue: 0,
                    },
                    {
                      name: "enable_periodic_discovery_cpestatus",
                      xtype: "checkboxfield",
                      boxLabel: t("label-cpe-status"),
                      reference: "enablePeriodicDiscoveryCPEStatus",
                      colspan: 2,
                    },
                    {
                      name: "periodic_discovery_cpestatus_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-interval-sec-2"),
                      uiStyle: "small",
                      minValue: 0,
                    },
                    {
                      name: "enable_periodic_discovery_peerstatus",
                      xtype: "checkboxfield",
                      boxLabel: t("label-peer-status"),
                      colspan: 2,
                    },
                    {
                      name: "periodic_discovery_peerstatus_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-interval-sec"),
                      uiStyle: "small",
                      minValue: 0,
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-discovery-alarm"),
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "periodic_discovery_alarm_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-periodic-alarm"),
                      allowBlank: true,
                      labelWidth: 135,
                      labelAlign: "left",
                      uiStyle: "medium",
                      store: [
                        ["E", t("label-enable")],
                        ["D", t("status-disable")],
                      ],
                      value: "D",
                    },
                    {
                      name: "periodic_discovery_fatal_alarm_weight",
                      xtype: "numberfield",
                      fieldLabel: t("label-fatal-alarm-weight"),
                      labelWidth: 150,
                      labelAlign: "left",
                      allowBlank: true,
                      minValue: 0,
                      uiStyle: "small",
                    },
                    {
                      name: "periodic_discovery_alarm_weight",
                      xtype: "numberfield",
                      fieldLabel: t("label-alarm-weight-2"),
                      labelWidth: 80,
                      labelAlign: "left",
                      allowBlank: true,
                      minValue: 0,
                      uiStyle: "small",
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  layout: "hbox",
                  title: t("app-title-process-telemetry"),
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "periodic_discovery_telemetry_sample",
                      xtype: "numberfield",
                      tooltip: t("help-sampling-value-for-periodic-discovery-interval-from-0-to-1-br-1-"),
                      labelWidth: 150,
                      minValue: 0,
                      maxValue: 1,
                      fieldLabel: t("label-periodic-sample"),
                      allowBlank: true,
                      uiStyle: "medium",
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
              ],
            },
            {
              title: t("btn-config"),
              tooltip: t("help-settings-policy-for-config-discovery-validation-and-mirroring-co"),
              items: [
                {
                  xtype: "fieldset",
                  title: t("app-title-config-policy"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "config_policy",
                      xtype: "combobox",
                      reference: "configPolicy",
                      fieldLabel: t("app-title-config-policy"),
                      allowBlank: false,
                      tooltip: t("help-select-method-of-config-gathering"),
                      displayField: "label",
                      valueField: "id",
                      store: {
                        fields: ["id", "label"],
                        data: [
                          {"id": "s", "label": t("label-script")},
                          {"id": "S", "label": t("msg-script-download")},
                          {"id": "D", "label": t("btn-download-script")},
                          {"id": "d", "label": t("btn-download")},
                        ],
                      },
                      bind: {
                        disabled: "{!enableBoxDiscoveryConfig.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "config_download_storage",
                      xtype: "main.extstorage.LookupField",
                      fieldLabel: t("label-storage"),
                      query: {
                        type: "config_upload",
                      },
                      allowBlank: true,
                      tooltip: t("help-external-storage-for-config-downloading-setup-in-main-setup-ext-"),
                      bind: {
                        disabled: "{disableConfigPolicy}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "config_download_template",
                      xtype: "main.template.LookupField",
                      fieldLabel: t("label-path-template"),
                      allowBlank: true,
                      tooltip: t("help-save-config-path-template-setup-on-main-setup-templates-subject-"),
                      bind: {
                        disabled: "{disableConfigPolicy}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-config-fetching"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "config_fetch_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-config-fetch-policy"),
                      allowBlank: false,
                      displayField: "label",
                      valueField: "id",
                      store: {
                        fields: ["id", "label"],
                        data: [
                          ["s", t("msg-prefer-startup")],
                          ["r", t("msg-prefer-running")],
                        ],
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("msg-config-mirror"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "config_mirror_policy",
                      xtype: "combobox",
                      reference: "mirrorPolicy",
                      fieldLabel: t("label-mirror-policy"),
                      allowBlank: false,
                      tooltip: t("help-mirror-collected-config-after-config-discovery-br-always-mirror-"),
                      displayField: "label",
                      valueField: "id",
                      store: {
                        fields: ["id", "label"],
                        data: [
                          {"id": "D", "label": t("msg-disabled")},
                          {"id": "A", "label": t("msg-always-mirror")},
                          {"id": "C", "label": t("msg-mirror-on-change")},
                        ],
                      },
                      bind: {
                        disabled: "{!enableBoxDiscoveryConfig.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },

                    },
                    {
                      name: "config_mirror_storage",
                      xtype: "main.extstorage.LookupField",
                      fieldLabel: t("label-storage"),
                      query: {
                        type: "config_mirror",
                      },
                      allowBlank: true,
                      tooltip: t("help-external-storage-for-config-save-setup-in-main-setup-ext-storage"),
                      bind: {
                        disabled: "{disableConfigMirrorPolicy}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "config_mirror_template",
                      xtype: "main.template.LookupField",
                      fieldLabel: t("label-path-template"),
                      allowBlank: true,
                      tooltip: t("help-save-config-path-template-setup-on-main-setup-templates-subject-"),
                      bind: {
                        disabled: "{disableConfigMirrorPolicy}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("msg-confdb"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "confdb_raw_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-raw-policy"),
                      allowBlank: false,
                      store: [
                        ["D", t("msg-disabled")],
                        ["E", t("header-enabled")],
                      ],
                      tooltip: t("help-append-raw-section-to-confdb"),
                      bind: {
                        disabled: "{!enableBoxDiscoveryConfig.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("app-title-config-validation"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "config_validation_policy",
                      xtype: "combobox",
                      fieldLabel: t("label-validation-policy"),
                      allowBlank: false,
                      store: [
                        ["D", t("msg-disabled")],
                        ["A", t("msg-always-validate")],
                        ["C", t("msg-validate-on-change")],
                      ],
                      tooltip: t("help-run-config-validate-process-br-always-validate-every-discovery-r"),
                      bind: {
                        disabled: "{!enableBoxDiscoveryConfig.checked}",
                      },
                      listeners: {
                        render: me.addTooltip,
                      },
                    },
                    {
                      name: "object_validation_policy",
                      xtype: "cm.objectvalidationpolicy.LookupField",
                      fieldLabel: t("header-policy"),
                      allowBlank: true,
                      bind: {
                        disabled: "{!enableBoxDiscoveryConfig.checked}",
                      },
                    },
                  ],
                },
                {
                  xtype: "fieldset",
                  title: t("msg-beef"),
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: 4,
                  },
                  items: [
                    {
                      name: "beef_policy",
                      xtype: "combobox",
                      reference: "beefPolicy",
                      fieldLabel: t("label-beef-policy"),
                      allowBlank: false,
                      displayField: "label",
                      valueField: "id",
                      store: {
                        fields: ["id", "label"],
                        data: [
                          {"id": "D", "label": t("msg-disabled")},
                          {"id": "A", "label": t("msg-always-collect")},
                          {"id": "C", "label": t("msg-collect-on-change")},
                        ],
                      },
                    },
                    {
                      name: "beef_storage",
                      xtype: "main.extstorage.LookupField",
                      fieldLabel: t("label-storage"),
                      query: {
                        type: "beef",
                      },
                      allowBlank: true,
                      bind: {
                        disabled: "{disableBeefPolicy}",
                      },
                    },
                    {
                      name: "beef_path_template",
                      xtype: "main.template.LookupField",
                      fieldLabel: t("label-path-template"),
                      allowBlank: true,
                      bind: {
                        disabled: "{disableBeefPolicy}",
                      },
                    },
                  ],
                },
              ],
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              title: t("label-metrics"),
              tooltip: t("help-setup-colleted-metric-on-devices-not-interface-br-interface-metr"),
              items: [
                {
                  name: "enable_metrics",
                  xtype: "checkboxfield",
                  boxLabel: t("label-enable-metrics"),
                },
                {
                  xtype: "container",
                  layout: "hbox",
                  defaults: {
                    padding: "0 8 0 0",
                  },
                  items: [
                    {
                      name: "metrics_default_interval",
                      xtype: "numberfield",
                      fieldLabel: t("label-default-interval-sec"),
                      labelWidth: 200,
                      allowBlank: false,
                      uiStyle: "small",
                      minValue: 0,
                      listeners: {
                        scope: me,
                        change: function(_item, newValue){
                          me.form.findField("metrics_default_interval_calculated").setValue(newValue);
                        },
                      },
                    },
                    {
                      name: "metrics_default_interval_calculated",
                      xtype: "displayfield",
                      renderer: NOC.render.Duration,
                    },
                  ],
                },
                {
                  name: "metrics",
                  xtype: "gridfield",
                  fieldLabel: t("label-metrics"),
                  labelAlign: "top",
                  columns: [
                    {
                      text: t("app-title-metrictype"),
                      dataIndex: "metric_type",
                      width: 150,
                      editor: {
                        xtype: "pm.metrictype.LookupField",
                      },
                      renderer: NOC.render.Lookup("metric_type"),
                    },
                    {
                      text: t("btn-is-stored"),
                      dataIndex: "is_stored",
                      width: 50,
                      renderer: NOC.render.Bool,
                      editor: "checkbox",
                    },
                    {
                      text: t("label-interval"),
                      dataIndex: "interval",
                      editor: {
                        xtype: "numberfield",
                        minValue: 0,
                      },
                    },
                  ],

                },
              ],
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              title: t("app-title-autosegmentation"),
              tooltip: t("help-settings-for-autosegmentation-process-br-automatically-detect-se"),
              items: [
                {
                  name: "autosegmentation_policy",
                  xtype: "combobox",
                  labelWidth: 150,
                  fieldLabel: t("header-policy"),
                  allowBlank: false,
                  store: [
                    ["d", t("msg-do-not-segmentate")],
                    ["e", t("msg-allow-autosegmentation")],
                    ["o", t("msg-segmentate-for-object-s-segment")],
                    ["c", t("msg-segmentate-for-child-segment")],
                  ],
                  uiStyle: "medium",
                },
                {
                  name: "autosegmentation_level_limit",
                  xtype: "numberfield",
                  tooltip: t("help-max-level-common-level-there-will-be-changed-segment-br-autosegm"),
                  labelWidth: 150,
                  fieldLabel: t("label-level-limit"),
                  allowBlank: false,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "autosegmentation_segment_name",
                  xtype: "textfield",
                  tooltip: t("help-jinja-template-for-creating-segment-name-br-worked-with-segmenta"),
                  labelWidth: 150,
                  fieldLabel: t("label-segment-name-2"),
                  allowBlank: true,
                  uiStyle: "extra",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
              ],
              listeners: {
                render: me.addTooltip,
              },
            },
          ],
        },
      ],
      formToolbar: [],
    });
    me.callParent();
  },
  //
  filters: [
    {
      title: t("app-title-box-discovery"),
      ftype: "list",
      listStore: {
        sorters: "label",
        data: [
          {field_name: "enable_box_discovery_profile", label: t("header-profile")},
          {field_name: "enable_box_discovery_version", lLabel: t("header-version")},
          {field_name: "enable_box_discovery_caps", label: t("header-caps")},
          {field_name: "enable_box_discovery_interface", label: t("header-interface")},
          {field_name: "enable_box_discovery_prefix", label: t("header-prefix")},
          {field_name: "enable_box_discovery_id", label: t("header-id")},
          {field_name: "enable_box_discovery_config", label: t("btn-config")},
          {field_name: "enable_box_discovery_asset", label: t("label-asset")},
          {field_name: "enable_box_discovery_vlan", label: t("app-title-vlan")},
          {field_name: "enable_box_discovery_metrics", label: t("label-metrics")},
        ],
      },
      valuesStore: {
        sorters: "label",
        data: [
          {label: t("header-enabled"), value: true},
          {label: t("msg-disabled"), value: false},
          {label: t("choice-all"), value: "all"},
        ],
      },
    },
    {
      title: t("app-title-topology-discovery"),
      ftype: "list",
      listStore: {
        sorters: "label",
        data: [
          {field_name: "enable_box_discovery_nri", label: t("label-nri")},
          {field_name: "enable_box_discovery_bfd", label: t("label-bfd")},
          {field_name: "enable_box_discovery_cdp", label: t("label-cdp")},
          {field_name: "enable_box_discovery_huawei_ndp", label: t("label-huawei-ndp")},
          {field_name: "enable_box_discovery_mikrotik_ndp", label: t("label-mikrotik-ndp")},
          {field_name: "enable_box_discovery_fdp", label: t("label-fdp")},
          {field_name: "enable_box_discovery_lldp", label: t("label-lldp")},
          {field_name: "enable_box_discovery_oam", label: t("label-oam")},
          {field_name: "enable_box_discovery_rep", label: t("label-rep")},
          {field_name: "enable_box_discovery_stp", label: t("label-stp")},
          {field_name: "enable_box_discovery_udld", label: t("label-udld")},
          {field_name: "enable_box_discovery_lacp", label: t("label-lacp")},
        ],
      },
      valuesStore: {
        sorters: "label",
        data: [
          {label: t("header-enabled"), value: true},
          {label: t("msg-disabled"), value: false},
          {label: t("choice-all"), value: "all"},
        ],
      },
    },
    {
      title: t("app-title-periodic-discovery"),
      ftype: "list",
      listStore: {
        sorters: "label",
        data: [
          {field_name: "enable_periodic_discovery_uptime", label: t("label-uptime")},
          {field_name: "enable_periodic_discovery_interface_status", label: t("label-interface-status")},
          {field_name: "enable_periodic_discovery_mac", label: t("header-mac")},
          {field_name: "enable_periodic_discovery_metrics", label: t("label-metrics")},
        ],
      },
      valuesStore: {
        sorters: "label",
        data: [
          {label: t("header-enabled"), value: true},
          {label: t("msg-disabled"), value: false},
          {label: t("choice-all"), value: "all"},
        ],
      },
    },
  ],
  //
  cleanData: function(v){
    Ext.each(v.metrics, function(m){
      if(m.low_error === ""){
        m.low_error = null;
      }
      if(m.low_warn === ""){
        m.low_warn = null;
      }
      if(m.high_warn === ""){
        m.high_warn = null;
      }
      if(m.high_error === ""){
        m.high_error = null;
      }
    });
  },
});
