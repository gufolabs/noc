//---------------------------------------------------------------------
// sa.objectdiagnosticconfig application
//---------------------------------------------------------------------
// Copyright (C) 2007-2022 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.objectdiagnosticconfig.Application");

Ext.define("NOC.sa.objectdiagnosticconfig.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.core.tagfield.Tagfield",
    "NOC.core.JSONPreview",
    "Ext.ux.form.GridField",
    "Ext.ux.form.StringsField",
    "NOC.main.ref.check.LookupField",
    "NOC.sa.objectdiagnosticconfig.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.fm.alarmclass.LookupField",
  ],
  model: "NOC.sa.objectdiagnosticconfig.Model",
  search: true,
  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/objectdiagnosticconfig/{0}/json/",
      previewName: "Object Diagnostic Config: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 30,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 200,
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
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-display-settings"),
          layout: "hbox",
          defaults: {
            padding: 4,
          },
          items: [
            {
              name: "display_order",
              xtype: "numberfield",
              fieldLabel: t("label-display-order"),
              value: 800,
              minValue: 0,
              allowBlank: true,
            },
            {
              name: "show_in_display",
              xtype: "checkbox",
              boxLabel: t("label-show-in-form"),
              tooltip: t("help-display-check-state-on-object-form"),
              allowBlank: true,
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              name: "hide_enable",
              xtype: "checkbox",
              boxLabel: t("label-hide-enabled"),
              tooltip: t("help-hide-from-display"),
              allowBlank: true,
              listeners: {
                render: me.addTooltip,
              },
            },
          ],
        },
        {
          name: "default_state",
          xtype: "combobox",
          fieldLabel: t("label-default-state"),
          tooltip: t("help-default-state-when-set-diagnostic"),
          store: [
            ["unknown", t("status-unknown")],
            ["enabled", t("header-enabled")],
            ["failed", t("msg-failed")],
          ],
          allowBlank: true,
          value: "unknown",
          uiStyle: "large",
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "state_policy",
          xtype: "combobox",
          fieldLabel: t("label-state-policy"),
          tooltip: t("help-policy-detect-diagnostic-success-or-failed-state-br-all-all-chec"),
          store: [
            ["ALL", t("msg-all")],
            ["ANY", t("msg-any-2")],
          ],
          allowBlank: true,
          value: "ANY",
          uiStyle: "large",
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "checks",
          fieldLabel: t("header-checks"),
          xtype: "gridfield",
          allowBlank: true,
          width: 350,
          columns: [
            {
              text: t("header-check"),
              dataIndex: "check",
              width: 200,
              editor: "main.ref.check.LookupField",
              allowBlank: false,
              sortable: false,
              renderer: NOC.render.Lookup("check"),
            },
            {
              editor: "stringlistfield",
              dataIndex: "ctx",
              width: 400,
              text: t("label-context"),
              sortable: false,
            },
            {
              text: t("app-title-address"),
              dataIndex: "address",
              editor: "textfield",
              width: 150,
              sortable: false,
            },
            {
              text: t("app-title-remotesystem"),
              dataIndex: "remote_system",
              width: 150,
              sortable: false,
              editor: {
                xtype: "main.remotesystem.LookupField",
              },
              renderer: NOC.render.Lookup("remote_system"),
            },
          ],
        },
        {
          xtype: "core.tagfield",
          url: "/sa/objectdiagnosticconfig/lookup/",
          fieldLabel: t("label-diagnostics"),
          tooltip: t("help-depended-diagnostic-for-calculate-state"),
          name: "diagnostics",
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          xtype: "fieldset",
          title: t("app-title-run-policy"),
          layout: {
            type: "table",
            columns: 2,
          },
          defaults: {
            padding: 2,
          },
          items: [
            {
              name: "enable_box",
              xtype: "checkbox",
              boxLabel: t("label-enable-box"),
              allowBlank: true,
            },
            {
              name: "run_policy",
              xtype: "combobox",
              fieldLabel: t("app-title-run-policy"),
              tooltip: t("help-condition-running-diagnostic-br-always-always-run-diagnostic-on-"),
              store: [
                ["A", t("msg-always")],
                ["F", t("msg-unknown-or-failed")],
              ],
              allowBlank: true,
              value: "F",
              uiStyle: "large",
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              name: "enable_periodic",
              xtype: "checkbox",
              boxLabel: t("label-enable-periodic"),
              allowBlank: true,
            },
            {
              name: "run_order",
              xtype: "combobox",
              fieldLabel: t("label-run-order"),
              tooltip: t("help-order-run-diagnostic-in-discovery-process-br-on-start-before-dis"),
              store: [
                ["S", t("msg-on-start")],
                ["E", t("msg-on-end")],
              ],
              allowBlank: true,
              value: "A",
              uiStyle: "large",
              listeners: {
                render: me.addTooltip,
              },
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-alarm"),
          items: [
            {
              name: "alarm_class",
              xtype: "fm.alarmclass.LookupField",
              fieldLabel: t("app-title-alarmclass"),
              tooltip: t("help-if-set-raise-alarm-when-diagnostic-to-failed-state"),
              uiStyle: "large",
              allowBlank: true,
              listeners: {
                render: me.addTooltip,
              },
            },
            {
              name: "alarm_labels",
              xtype: "labelfield",
              fieldLabel: t("btn-alarm-labels"),
              tooltip: t("help-add-setting-labels-to-raised-alarm-label-must-b-enable-alarm-b-s"),
              allowBlank: true,
              isTree: false,
              filterProtected: false,
              pickerPosition: "down",
              listeners: {
                render: me.addTooltip,
              },
              uiStyle: "large",
              query: {
                "allow_models": ["fm.Alarm"],
              },
            },
          ],
        },
        {
          name: "save_history",
          xtype: "checkbox",
          boxLabel: t("label-save-history"),
          allowBlank: true,
        },
        {
          name: "match",
          xtype: "listform",
          fieldLabel: t("label-match-rules"),
          rows: 4,
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
                "allow_wildcard": true,
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
                "allow_wildcard": true,
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
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
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
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
