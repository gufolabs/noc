//---------------------------------------------------------------------
// sa.reactionrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.reactionrule.Application");

Ext.define("NOC.sa.reactionrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.TemplatePreview",
    "NOC.core.ListFormField",
    "NOC.core.StringListField",
    "NOC.core.tagfield.Tagfield",
    "NOC.core.StringListField",
    "NOC.core.label.LabelField",
    "NOC.core.combotree.ComboTree",
    "NOC.fm.eventclass.LookupField",
    "NOC.fm.alarmclass.LookupField",
    "NOC.main.handler.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.inv.capability.LookupField",
    "NOC.sa.action.LookupField",
    "NOC.sa.reactionrule.LookupField",
    "NOC.main.ref.modelid.LookupField",
    "Ext.ux.form.JSONField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.sa.reactionrule.Model",
  search: true,

  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 500,
    },
    {
      text: t("header-builtin"),
      dataIndex: "is_builtin",
      width: 50,
      renderer: NOC.render.Bool,
    },
    {
      text: t("header-alarm-disposition"),
      dataIndex: "alarm_disposition",
      flex: 1,
      renderer: NOC.render.Lookup("alarm_disposition"),
    },
    {
      text: t("header-pref"),
      dataIndex: "preference",
      width: 50,
    },
  ],

  initComponent: function(){
    var me = this;
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/reactionrule/{0}/json/",
      previewName: "Reaction Rule: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    //
    Ext.apply(me, {
      fields: [
        {
          xtype: "textfield",
          name: "name",
          fieldLabel: t("header-name"),
          allowBlank: false,
        },
        {
          xtype: "displayfield",
          name: "uuid",
          fieldLabel: t("label-uuid"),
        },
        {
          xtype: "textarea",
          name: "description",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          xtype: "numberfield",
          name: "preference",
          fieldLabel: t("label-preference"),
          allowBlank: false,
          uiStyle: "small",
          defaultValue: 1000,
          minValue: 0,
          maxValue: 10000,
        },
        {
          name: "object_model",
          xtype: "combobox",
          fieldLabel: t("label-object-class"),
          allowBlank: false,
          store: [
            ["sa.ManagedObject", t("header-managed-object-62561c")],
            ["sa.Service", t("header-service")],
            ["sla.SLAProbe", t("app-title-slaprobe")],
            ["inv.Interface", t("msg-network-interface")],
            ["inv.Object", t("msg-inventory-object")],
            ["vc.L2Domain", t("header-l2-domain")],
            ["vc.VLAN", t("app-title-vlan")],
          ],
          uiStyle: "medium",
        },
        {
          name: "operations",
          xtype: "tagfield",
          fieldLabel: t("label-operations"),
          allowBlank: false,
          store: [
            ["create", t("app-title-create")],
            ["update", t("status-update")],
            ["delete", t("btn-delete")],
            ["topology", t("app-title-topology")],
            ["config_changed", t("header-config-changed")],
            ["version_changed", t("header-version-changed")],
            ["version_set", t("msg-version-set")],
            ["any", t("msg-any")],
          ],
          uiStyle: "medium",
        },
        {
          xtype: "fieldset",
          title: t("app-title-replace-rule"),
          layout: "hbox",
          defaults: {
            labelAlign: "left",
            margin: 5,
          },
          items: [
            {
              name: "replace_rule",
              xtype: "sa.reactionrule.LookupField",
              fieldLabel: t("app-title-replace-rule"),
              uiStyle: "medium",
              allowBlank: true,
            },
            {
              name: "replace_rule_policy",
              xtype: "combobox",
              fieldLabel: t("label-replace-policy"),
              store: [
                ["D", t("status-disable")],
                ["w", t("msg-whole")],
                ["c", t("msg-extend-condition")],
                ["a", t("app-title-action")],
              ],
              value: "none",
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "field_data",
          xtype: "gridfield",
          fieldLabel: t("label-field-data"),
          columns: [
            {
              text: t("btn-field"),
              dataIndex: "field",
              editor: "textfield",
              width: 250,
            },
            {
              text: t("app-title-capability"),
              dataIndex: "capability",
              renderer: NOC.render.Lookup("capability"),
              width: 250,
              editor: "inv.capability.LookupField",
            },
            {
              text: t("header-cond"),
              dataIndex: "condition",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["regex", t("msg-regex")],
                  ["contains", t("msg-contains")],
                  ["exists", t("msg-exists")],
                  ["eq", t("msg-equal")],
                  ["ne", t("msg-not-equal")],
                  ["gte", t("msg-greater-equal")],
                  ["gt", t("msg-greater")],
                  ["lte", t("msg-less-equal")],
                  ["lt", t("msg-less")],
                ],
              },
              renderer: NOC.render.Choices({
                "regex": t("msg-regex"),
                "contains": t("msg-contains"),
                "exists": t("msg-exists"),
                "eq": t("msg-equal"),
                "ne": t("msg-not-equal"),
                "gte": t("msg-greater-equal"),
                "gt": t("msg-greater"),
                "lte": t("msg-less-equal"),
                "lt": t("msg-less"),
              }),
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              editor: "textfield",
              width: 100,
            },
            {
              text: t("header-set-context"),
              dataIndex: "set_context",
              editor: "textfield",
              width: 100,
            },
          ],
        },
        {
          name: "affected_rules",
          xtype: "gridfield",
          fieldLabel: t("label-affected-rules"),
          columns: [
            {
              text: t("header-modelid"),
              dataIndex: "model_id",
              renderer: NOC.render.Lookup("model_id"),
              editor: "main.ref.modelid.LookupField",
              width: 150,
            },
            {
              text: t("header-rule"),
              dataIndex: "rule",
              renderer: NOC.render.Lookup("rule"),
              editor: "sa.reactionrule.LookupField",
              width: 150,
            },
            {
              text: t("header-suppress-action"),
              dataIndex: "suppress_action",
              width: 70,
              editor: "checkboxfield",
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-extend-ctx"),
              dataIndex: "extend_ctx",
              width: 70,
              editor: "checkboxfield",
              renderer: NOC.render.Bool,
            },
          ],
        },
        {
          name: "actions",
          xtype: "gridfield",
          fieldLabel: t("label-run-actions"),
          columns: [
            {
              text: t("app-title-action"),
              dataIndex: "action",
              width: 100,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["handler", t("app-title-handler")],
                  ["action_command", t("label-commands")],
                  ["run_discovery", t("btn-run-discovery")],
                  ["fire_wf_event", t("msg-fire-event")],
                ],
              },
              renderer: NOC.render.Choices({
                "handler": t("app-title-handler"),
                "action_command": t("label-commands"),
                "run_discovery": t("btn-run-discovery"),
                "fire_wf_event": t("msg-fire-event"),
              }),
            },
            {
              text: t("btn-run"),
              dataIndex: "run",
              width: 75,
              allowBlank: false,
              editor: {
                xtype: "combobox",
                store: [
                  ["A", t("msg-always")],
                  ["F", t("msg-prev-failed")],
                  ["S", t("msg-prev-success")],
                ],
              },
              renderer: NOC.render.Choices({
                "A": t("msg-always"),
                "F": t("msg-prev-failed"),
                "S": t("msg-prev-successy"),
              }),
            },
            {
              text: t("label-commands"),
              dataIndex: "commands",
              width: 150,
              editor: {
                xtype: "sa.action.LookupField",
              },
              renderer: NOC.render.Lookup("commands"),
            },
            {
              text: t("header-allow-fail"),
              dataIndex: "allow_fail",
              width: 50,
              editor: "checkboxfield",
              renderer: NOC.render.Bool,
            },
            {
              text: t("btn-cancel"),
              dataIndex: "cancel_command",
              width: 50,
              editor: "checkboxfield",
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-domain-ctx"),
              dataIndex: "expand_domain_ctx",
              width: 70,
              editor: "checkboxfield",
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-over-topology"),
              dataIndex: "over_topology",
              width: 70,
              editor: "checkboxfield",
              renderer: NOC.render.Bool,
            },
            {
              editor: "stringlistfield",
              dataIndex: "context",
              width: 400,
              text: t("label-context"),
            },
            {
              text: t("app-title-handler"),
              dataIndex: "handler",
              width: 150,
              editor: {
                xtype: "main.handler.LookupField",
                query: {
                  allow_reaction: true,
                },
              },
              renderer: NOC.render.Lookup("handler"),
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          defaults: {
            labelAlign: "top",
            margin: 5,
          },
          title: t("header-notification"),
          items: [
            {
              name: "notification_group",
              xtype: "main.notificationgroup.LookupField",
              fieldLabel: t("label-new-event-notification"),
              labelWidth: 200,
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          defaults: {
            labelAlign: "top",
            margin: 5,
          },
          title: t("header-disposition"),
          items: [
            {
              name: "alarm_disposition",
              xtype: "fm.alarmclass.LookupField",
              fieldLabel: t("label-dispose-alarm"),
              uiStyle: "medium",
              allowBlank: true,
            },
          ],
        },
        {
          name: "stop_processing",
          xtype: "checkbox",
          boxLabel: t("label-stop-processing-rules"),
        },
        {
          name: "vars_conditions_op",
          xtype: "combobox",
          fieldLabel: t("label-condition-op-vars"),
          store: [
            ["AND", t("msg-and")],
            ["OR", t("msg-or")],
          ],
          uiStyle: "medium",
        },
        {
          name: "conditions",
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
              xtype: "core.tagfield",
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "groups",
              allowBlank: true,
              uiStyle: "extra",
            },
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              xtype: "core.tagfield",
              url: "/wf/state/lookup/",
              fieldLabel: t("label-wf-states"),
              name: "wf_states",
              allowBlank: true,
              uiStyle: "extra",
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
