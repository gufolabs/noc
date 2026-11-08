//---------------------------------------------------------------------
// fm.oidalias application
//---------------------------------------------------------------------
// Copyright (C) 2007-2011 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.oidalias.Application");

Ext.define("NOC.fm.oidalias.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.fm.oidalias.Model",
  ],
  model: "NOC.fm.oidalias.Model",
  search: true,

  initComponent: function(){
    var me = this;
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/fm/oidalias/{0}/json/",
      previewName: "OID Alias: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-rewrite-oid"),
          dataIndex: "rewrite_oid",
          width: 200,
        },
        {
          text: t("header-to-oid"),
          dataIndex: "to_oid",
          width: 200,
        },
        {
          text: t("header-is-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 50,
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
          name: "rewrite_oid",
          xtype: "textfield",
          fieldLabel: t("header-rewrite-oid"),
          allowBlank: false,
          regex: /^[0-9]+(\.[0-9]+)+$/,
        },
        {
          name: "to_oid",
          xtype: "textfield",
          fieldLabel: t("header-to-oid"),
          allowBlank: true,
          regex: /^[0-9]+(\.[0-9]+)+$/,
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
