//---------------------------------------------------------------------
// main.glyph application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.glyph.Application");

Ext.define("NOC.main.glyph.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.main.glyph.Model",
  ],
  model: "NOC.main.glyph.Model",
  search: true,

  initComponent: function(){
    var me = this;

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("label-code"),
          dataIndex: "code",
          width: 100,
          renderer: (value) => `U+${value.toString(16).toUpperCase()}`,
        },
        {
          text: t("app-title-glyph"),
          dataIndex: "name",
          flex: 1,
          renderer: (value) => `<i class="gf ${value}"></i>`,
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
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
          allowBlank: true,
        },
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code-hex"),
          emptyText: t("label-enter-hex-number"),
          allowBlank: false,
          regex: /^[0-9a-fA-F]+$/,
          invalidText: t("msg-invalid-hex-format"),
          valueToRaw: function(value){
            return Ext.util.Format.hex(value);
          },
          rawToValue: function(value){
            if(this.regex.test(value)){
              return parseInt(value, 16);
            }
            return value;
          },
          listeners: {
            change: function(field, newValue){
              field.up().queryById("preview").setValue(newValue);
            },
          },
          uiStyle: "small",
        },
        {
          itemId: "preview",
          xtype: "displayfield",
          fieldLabel: t("help-preview"),
          renderer: (value, field) => {
            if(value){
              let name = field.up().getForm().findField("name")?.getValue();
              return `<i class="gf gf-3x ${name}"></i>`
            } else{
              return ""
            }
          },
        },
      ],
    });
    me.callParent();
  },
});
