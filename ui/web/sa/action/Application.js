//---------------------------------------------------------------------
// sa.action application
//---------------------------------------------------------------------
// Copyright (C) 2007-2015 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.action.Application");

Ext.define("NOC.sa.action.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.main.handler.LookupField",
    "NOC.sa.action.Model",
    "NOC.core.StringListField",
    "NOC.sa.action.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.sa.action.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/action/{0}/json/",
      previewName: "Action: {0}",
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
          text: t("header-label"),
          dataIndex: "Label",
          width: 200,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
        {
          text: t("header-lvl"),
          dataIndex: "access_level",
          width: 50,
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "medium",
          regex: /^[a-zA-Z_][a-zA-Z_\-0-9]*$/,
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "label",
          xtype: "textfield",
          fieldLabel: t("header-label"),
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
          name: "access_level",
          xtype: "numberfield",
          fieldLabel: t("label-access-level"),
          value: 15,
          minValue: 0,
          maxValue: 15,
          uiStyle: "small",
        },
        {
          name: "handler",
          xtype: "main.handler.LookupField",
          fieldLabel: t("app-title-handler"),
          query: {
            allow_action: true,
          },
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "params",
          xtype: "gridfield",
          fieldLabel: t("label-params"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              width: 150,
              editor: {
                xtype: "textfield",
                regex: /^[a-zA-Z_][a-zA-Z_\-0-9]*$/,
              },
            },
            {
              text: t("header-required"),
              dataIndex: "is_required",
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-type"),
              dataIndex: "type",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["bool", "Boolean"],
                  ["str", "String"],
                  ["int", "Integer"],
                  ["float", "Float"],
                  ["mac", "MAC Address"],
                  ["interface_name", "Interface"],
                  ["vlan", "Vlan Num"],
                  ["ip_address", "IP Address"],
                  ["ip_vrf", "IP VRF"],
                ],
              },
            },
            {
              text: t("header-multi"),
              dataIndex: "multi",
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-default"),
              dataIndex: "default",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              flex: 100,
              editor: "textfield",
            },
            {
              text: t("header-scope-command"),
              dataIndex: "scope_command",
              flex: 200,
              editor: "textfield",
            },
            {
              text: t("header-scope-exit"),
              dataIndex: "scope_exit",
              flex: 100,
              editor: "textfield",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 100,
              editor: "textfield",
            },
          ],
        },
        {
          name: "action_set",
          xtype: "gridfield",
          fieldLabel: t("label-action-set"),
          columns: [
            {
              text: t("app-title-action"),
              dataIndex: "action",
              width: 200,
              renderer: NOC.render.Lookup("action"),
              editor: {
                xtype: "core.combo",
                restUrl: "/sa/action/lookup/",
              },
            },
            {
              text: t("header-execute"),
              dataIndex: "execute",
              width: 150,
              editor: {
                xtype: "combobox",
                store: [
                  ["S", t("btn-set")],
                  ["D", t("btn-disable-scope")],
                  ["E", t("btn-enable-scope")],
                  ["R", t("msg-rollback")],
                ],
              },
              renderer: NOC.render.Choices({
                "S": t("btn-set"),
                "D": t("btn-disable-scope"),
                "E": t("btn-enable-scope"),
                "R": t("msg-rollback"),
              }),
            },
            {
              text: t("btn-cancel"),
              dataIndex: "cancel",
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              editor: "stringlistfield",
              dataIndex: "domain_scopes",
              width: 200,
              text: t("header-domain-scopes"),
            },
            {
              editor: "stringlistfield",
              dataIndex: "params_ctx",
              width: 400,
              text: t("header-params-map"),
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
