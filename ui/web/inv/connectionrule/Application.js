//---------------------------------------------------------------------
// inv.connectionrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.connectionrule.Application");

Ext.define("NOC.inv.connectionrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.StringListField",
    "NOC.inv.connectionrule.Model",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.connectionrule.Model",
  search: true,

  actions: [
    {
      title: t("app-title-get-json"),
      action: "json",
      glyph: NOC.glyph.file,
      resultTemplate: "JSON",
    },
  ],

  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/connectionrule/{0}/json/",
      previewName: "Connection Rule: {0}",
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
          width: 50,
          renderer: NOC.render.Bool,
          sortable: false,
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
          fieldLabel: t("header-name"),
          xtype: "textfield",
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
        },
        {
          name: "context",
          xtype: "gridfield",
          fieldLabel: t("label-context"),
          columns: [
            {
              text: t("header-type"),
              dataIndex: "type",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              width: 70,
              editor: "textfield",
            },
            {
              text: t("header-reset-scopes"),
              dataIndex: "reset_scopes",
              flex: 1,
              editor: "stringlistfield",
            },
          ],
        },
        {
          name: "rules",
          xtype: "gridfield",
          fieldLabel: t("header-rules"),
          columns: [
            {
              text: t("header-match-type"),
              dataIndex: "match_type",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-match-connection"),
              dataIndex: "match_connection",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-scope"),
              dataIndex: "scope",
              width: 50,
              editor: "textfield",
            },
            {
              text: t("header-target-type"),
              dataIndex: "target_type",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-target-number"),
              dataIndex: "target_number",
              width: 100,
              editor: "textfield",
            },
            {
              text: t("header-target-connection"),
              dataIndex: "target_connection",
              width: 100,
              editor: "textfield",
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
      title: t("app-title-by-is-builtin"),
      name: "is_builtin",
      ftype: "boolean",
    },
  ],

  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
