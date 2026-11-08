//---------------------------------------------------------------------
// sa.objectdiscoveryrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.objectdiscoveryrule.Application");

Ext.define("NOC.sa.objectdiscoveryrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.sa.objectdiscoveryrule.Model",
    "NOC.core.label.LabelField",
    "NOC.core.tagfield.Tagfield",
    "NOC.wf.workflow.LookupField",
    "NOC.main.pool.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.main.handler.LookupField",
    "NOC.main.ref.check.LookupField",
    "NOC.main.modeltemplate.LookupField",
    "NOC.main.remotesystem.LookupField",
    "Ext.ux.form.GridField",
    "NOC.core.ListFormField",
    "NOC.core.JSONPreview",
  ],
  model: "NOC.sa.objectdiscoveryrule.Model",

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/objectdiscoveryrule/{0}/json/",
      previewName: "Model Template: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
          align: "left",
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          width: 50,
          renderer: NOC.render.Bool,
          sortable: false,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 50,
          align: "left",
        },
        {
          text: t("header-pref-2"),
          // tooltip: "Preference", - broken in ExtJS 5.1
          dataIndex: "preference",
          width: 50,
          align: "right",
        },
        {
          text: t("header-default-action"),
          dataIndex: "default_action",
          width: 100,
          align: "left",
        },
        {
          text: t("header-ip-scan-discovery"),
          dataIndex: "enable_ip_scan_discovery",
          renderer: NOC.render.Bool,
          width: 100,
          align: "left",
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
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
          defaultValue: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          uiStyle: "large",
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          uiStyle: "large",
          fieldLabel: t("label-workflow"),
          allowBlank: true,
        },
        {
          name: "preference",
          xtype: "numberfield",
          fieldLabel: t("label-preference"),
          allowBlank: true,
          uiStyle: "small",
          defaultValue: 70,
        },
        {
          name: "network_ranges",
          xtype: "gridfield",
          fieldLabel: t("label-network-ranges"),
          columns: [
            {
              text: t("header-network"),
              dataIndex: "network",
              editor: "textfield",
              width: 250,
            },
            {
              text: t("label-pool"),
              dataIndex: "pool",
              width: 200,
              editor: {
                xtype: "main.pool.LookupField",
              },
              renderer: NOC.render.Lookup("pool"),
            },
            {
              text: t("label-exclude"),
              dataIndex: "exclude",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
            },
          ],
        },
        {
          name: "sources",
          xtype: "gridfield",
          fieldLabel: t("label-sources"),
          columns: [
            {
              text: t("header-source"),
              dataIndex: "source",
              width: 150,
              sortable: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["etl", t("btn-etl")],
                  ["network-scan", t("msg-network-scan")],
                  ["neighbor", t("msg-device-neighbors")],
                  ["manual", t("app-title-manual")],
                ],
              },
            },
            {
              text: t("app-title-remotesystem"),
              dataIndex: "remote_system",
              width: 200,
              sortable: false,
              editor: {
                xtype: "main.remotesystem.LookupField",
              },
              renderer: NOC.render.Lookup("remote_system"),
            },
            {
              text: t("header-update-last-seen"),
              dataIndex: "update_last_seen",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
              sortable: false,
            },
            {
              text: t("header-required"),
              dataIndex: "is_required",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              width: 50,
              sortable: false,
            },
            {
              text: t("label-sync-policy"),
              dataIndex: "sync_policy",
              width: 150,
              sortable: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["A", t("choice-all")],
                  ["M", t("msg-mappings-only")],
                ],
              },
            },
            {
              text: t("header-remove-policy"),
              dataIndex: "remove_policy",
              width: 150,
              sortable: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["D", t("status-disable")],
                  ["U", t("msg-unmanaged")],
                  ["R", t("btn-remove")],
                ],
              },
            },
          ],
        },
        {
          name: "update_interval",
          xtype: "numberfield",
          fieldLabel: t("label-check-update-interval-sec"),
          allowBlank: true,
          uiStyle: "medium",
          defaultValue: 0,
          minValue: 0,
        },
        {
          name: "expired_ttl",
          xtype: "numberfield",
          fieldLabel: t("label-expired-ttl-sec"),
          allowBlank: true,
          uiStyle: "medium",
          defaultValue: 0,
          minValue: 0,
        },
        {
          name: "default_action",
          xtype: "combobox",
          fieldLabel: t("header-default-action"),
          store: [
            ["new", t("msg-as-new")],
            ["ignore", t("msg-send-ignore")],
            ["skip", t("msg-skip-rule")],
            ["approve", t("msg-send-approve")],
          ],
          value: "new",
          uiStyle: "medium",
        },
        {
          name: "sync_approved",
          xtype: "checkbox",
          boxLabel: t("label-sync-approved-records"),
        },
        {
          name: "default_template",
          xtype: "main.modeltemplate.LookupField",
          uiStyle: "large",
          fieldLabel: t("label-default-template"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("header-ip-scan-discovery"),
          items: [
            {
              name: "enable_ip_scan_discovery",
              xtype: "checkbox",
              boxLabel: t("label-enable-ip-scan-discovery"),
            },
            {
              xtype: "container",
              layout: "hbox",
              defaults: {
                padding: "0 8 0 0",
              },
              items: [
                {
                  name: "ip_scan_discovery_interval",
                  xtype: "numberfield",
                  fieldLabel: t("label-interval-sec"),
                  allowBlank: true,
                  uiStyle: "small",
                  minValue: 0,
                  listeners: {
                    scope: me,
                    change: function(_item, newValue){
                      me.form.findField("ip_scan_discovery_interval_calculated").setValue(newValue);
                    },
                  },
                },
                {
                  name: "ip_scan_discovery_interval_calculated",
                  xtype: "displayfield",
                  renderer: NOC.render.Duration,
                },
              ],
            },
            {
              name: "checks",
              fieldLabel: t("header-checks"),
              xtype: "gridfield",
              allowBlank: true,
              width: 550,
              columns: [
                {
                  text: t("header-check"),
                  dataIndex: "check",
                  width: 100,
                  editor: "main.ref.check.LookupField",
                  allowBlank: false,
                  renderer: NOC.render.Lookup("check"),
                },
                {
                  text: t("btn-argument"),
                  dataIndex: "arg0",
                  editor: "textfield",
                  width: 150,
                },
                {
                  text: t("header-port"),
                  dataIndex: "port",
                  width: 50,
                  editor: {
                    xtype: "numberfield",
                    defaultValue: 0,
                  },
                },
              ],
            },
          ],
        },
        {
          name: "conditions",
          xtype: "listform",
          rows: 6,
          labelAlign: "top",
          uiStyle: "large",
          fieldLabel: t("label-match-conditions"),
          items: [
            {
              name: "match_labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: true,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
                "allow_wildcard": true,
              },
            },
            {
              xtype: "core.tagfield",
              lazyLoadTree: true,
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "match_groups",
              allowBlank: true,
              uiStyle: "extra",
            },
            {
              name: "match_checks",
              xtype: "gridfield",
              fieldLabel: t("label-check-match"),
              columns: [
                {
                  text: t("header-check"),
                  dataIndex: "check",
                  width: 200,
                  editor: "main.ref.check.LookupField",
                  allowBlank: false,
                  renderer: NOC.render.Lookup("check"),
                },
                {
                  text: t("header-port"),
                  dataIndex: "port",
                  editor: {
                    xtype: "numberfield",
                    defaultValue: 0,
                  },
                },
                {
                  text: t("btn-match-state"),
                  dataIndex: "match_state",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["ok", t("status-ok")],
                      ["fail", t("status-fail")],
                      ["any", t("msg-any")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "ok": t("status-ok"),
                    "fail": t("status-fail"),
                    "any": t("msg-any"),
                  }),
                },
              ],
            },
            {
              name: "match_data",
              xtype: "gridfield",
              fieldLabel: t("label-data-match"),
              columns: [
                {
                  text: t("btn-field"),
                  dataIndex: "field",
                  editor: "textfield",
                  width: 250,
                },
                {
                  text: t("btn-op"),
                  dataIndex: "op",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["regex", t("msg-regex")],
                      ["contains", t("msg-contains")],
                      ["eq", t("msg-equal")],
                      ["gte", t("msg-greater-equal")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "regex": t("msg-regex"),
                    "contains": t("msg-contains"),
                    "eq": t("msg-equal"),
                    "gte": t("msg-greater-equal"),
                  }),
                },
                {
                  text: t("header-value"),
                  dataIndex: "value",
                  editor: "textfield",
                  flex: 1,
                },
              ],
            },
            {
              name: "action",
              xtype: "combobox",
              fieldLabel: t("header-default-action"),
              store: [
                ["new", t("msg-as-new")],
                ["ignore", t("msg-send-ignore")],
                ["skip", t("msg-skip-rule")],
                ["approve", t("msg-send-approve")],
              ],
              value: "new",
              uiStyle: "medium",
            },
          ],
        },
      ],
      formToolbar: [
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-show-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
      ],
    });
    me.callParent();
  },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },

});
