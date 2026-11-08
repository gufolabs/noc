//---------------------------------------------------------------------
// sa.profile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.profile.Application");

Ext.define("NOC.sa.profile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.sa.profile.Model",
  ],
  model: "NOC.sa.profile.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/profile/{0}/json/",
      previewName: "Profile: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: "Name",
          dataIndex: "name",
          flex: 1,
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
          regex: /[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+/,
          uiStyle: "medium",
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

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
