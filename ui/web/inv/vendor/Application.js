//---------------------------------------------------------------------
// inv.vendor application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.vendor.Application");

Ext.define("NOC.inv.vendor.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.TagsField",
    "NOC.inv.vendor.Model",
  ],
  model: "NOC.inv.vendor.Model",
  search: true,

  columns: [
    {
      text: t("header-name"),
      dataIndex: "name",
      width: 150,
    },
    {
      text: t("header-full-name"),
      dataIndex: "full_name",
      width: 200,
    },
    {
      text: t("label-code"),
      dataIndex: "code",
      width: 200,
    },
    {
      text: t("header-site"),
      dataIndex: "site",
      flex: 1,
      renderer: NOC.render.URL,
    },
    {
      text: t("header-builtin"),
      dataIndex: "is_builtin",
      width: 30,
      renderer: NOC.render.Bool,
      sortable: false,
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
      name: "full_name",
      xtype: "textfield",
      fieldLabel: t("header-full-name"),
      allowBlank: false,
      uiStyle: "medium",
    },
    {
      name: "uuid",
      xtype: "displayfield",
      fieldLabel: t("label-uuid"),
    },
    {
      name: "code",
      xtype: "tagsfield",
      fieldLabel: t("label-code"),
      allowBlank: false,
    },
    {
      name: "site",
      xtype: "textfield",
      fieldLabel: t("header-site"),
      allowBlank: false,
    },
  ],
  //
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/vendor/{0}/json/",
      previewName: "Vendor: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);
    Ext.apply(me, {
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
