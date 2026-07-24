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
    "NOC.core.JSONPreviewII",
    "NOC.sa.profile.Model",
  ],
  model: "NOC.sa.profile.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreviewII", {
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
          width: 200,
        },
        {
          text: __("Builtin"),
          dataIndex: "is_builtin",
          width: 50,
          renderer: NOC.render.Bool,
          sortable: false,
        },
        {
          text: __("Description"),
          dataIndex: "description",
          flex: 1,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: __("Name"),
          allowBlank: false,
          regex: /[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+/,
          uiStyle: "medium",
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: __("UUID"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: __("Description"),
          allowBlank: true,
        },
      ],

      formToolbar: [
        {
          text: __("JSON"),
          glyph: NOC.glyph.file,
          tooltip: __("Show JSON"),
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
