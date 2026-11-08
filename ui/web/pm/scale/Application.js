//---------------------------------------------------------------------
// pm.scale application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.scale.Application");

Ext.define("NOC.pm.scale.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.pm.scale.Model",
  ],
  model: "NOC.pm.scale.Model",
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/pm/scale/{0}/json/",
      previewName: "Scale: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("label-code"),
          dataIndex: "code",
          width: 50,
        },
        {
          text: t("app-title-scale"),
          dataIndex: "exp",
          flex: 1,
          renderer: function(value, metaData, record){
            let exp = record.get("exp");
            if(exp === 0){
              return "1"
            } else{
              return record.get("base") + "<sup>" + record.get("exp") + "</sup>";
            }
          },
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code"),
          uiStyle: "medium",
          allowBlank: false,
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
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "base",
          xtype: "combobox",
          fieldLabel: t("header-base"),
          store: [
            [2, "2"],
            [10, "10"],
          ],
          allowBlank: false,
        },
        {
          name: "exp",
          xtype: "numberfield",
          fieldLabel: t("label-exponent"),
          allowBlank: false,
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