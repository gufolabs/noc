//---------------------------------------------------------------------
// sa.actioncommands application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.actioncommands.Application");

Ext.define("NOC.sa.actioncommands.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.sa.actioncommands.Model",
    "NOC.sa.action.LookupField",
    "NOC.sa.profile.LookupField",
    "NOC.core.ListFormField",
    "Ext.ux.form.GridField",
    "Ext.ux.form.JSONField",
    "Ext.ux.form.GridField",

  ],
  model: "NOC.sa.actioncommands.Model",
  search: true,
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/actioncommands/{0}/json/",
      previewName: "Action Commands: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 300,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 100,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("label-preference"),
          dataIndex: "preference",
          width: 100,
          align: "right",
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
          name: "action",
          xtype: "sa.action.LookupField",
          fieldLabel: t("app-title-action"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          uiStyle: "extra",
        },
        {
          name: "profile",
          xtype: "sa.profile.LookupField",
          fieldLabel: t("header-profile"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "config_mode",
          xtype: "checkbox",
          boxLabel: t("label-config-mode"),
        },
        {
          name: "exit_scope_commands",
          xtype: "textfield",
          fieldLabel: t("label-exit-scope-commands"),
          uiStyle: "medium",
        },
        {
          name: "disable_when_change",
          xtype: "combobox",
          fieldLabel: t("label-disable-when-change"),
          store: [
            ["N", t("msg-nothing")],
            ["O", t("msg-out-of-scope")],
            ["I", t("msg-inner-of-scope")],
          ],
          value: "new",
          uiStyle: "medium",
        },
        {
          name: "preference",
          xtype: "numberfield",
          fieldLabel: t("label-preference"),
          allowBlank: true,
        },
        {
          name: "timeout",
          xtype: "numberfield",
          fieldLabel: t("label-timeout"),
          allowBlank: true,
        },
        {
          name: "match",
          xtype: "gridfield",
          fieldLabel: t("app-title-match"),
          columns: [
            {
              text: t("header-platform-regex"),
              dataIndex: "platform_re",
              editor: "textfield",
            },
            {
              text: t("header-version-regex"),
              dataIndex: "version_re",
              editor: "textfield",
            },
          ],
        },
        {
          name: "scopes",
          xtype: "gridfield",
          fieldLabel: t("label-scopes"),
          columns: [
            {
              text: t("header-scope"),
              dataIndex: "scope",
              sortable: false,
              editor: "textfield",
              width: 100,
            },
            {
              text: t("header-enter-scope"),
              dataIndex: "enter_scope",
              sortable: false,
              editor: "checkbox",
              width: 70,
            },
            {
              text: t("header-command"),
              dataIndex: "command",
              sortable: false,
              editor: "textfield",
              width: 200,
            },
            {
              text: t("header-exit-command"),
              dataIndex: "exit_command",
              sortable: false,
              editor: "textfield",
              width: 100,
            },
          ],
        },
        {
          name: "commands",
          xtype: "textarea",
          fieldLabel: t("label-commands"),
          allowBlank: false,
          grow: true,
          growMin: 100, // Minimum height when growing
          growMax: 200, // Maximum height when growing
        },
        {
          name: "test_cases",
          xtype: "listform",
          rows: 3,
          fieldLabel: t("label-test-cases"),
          labelAlign: "top",
          items: [
            {
              xtype: "textarea",
              name: "output",
              width: 900,
              fieldLabel: t("header-output"),
            },
            {
              xtype: "jsonfield",
              name: "context",
              fieldLabel: t("label-context"),
              width: 500,
              editor: "jsonfield",
              renderer: NOC.render.JSON,
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

  filters: [
    {
      title: t("app-title-by-sa-profile"),
      name: "profile",
      ftype: "lookup",
      lookup: "sa.profile",
    },
    {
      title: t("app-title-by-action"),
      name: "action",
      ftype: "lookup",
      lookup: "sa.action",
    },
  ],

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
