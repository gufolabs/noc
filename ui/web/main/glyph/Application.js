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
          text: __("Name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: __("Code"),
          dataIndex: "code",
          width: 100,
          renderer: (value) => `U+${value.toString(16).toUpperCase()}`,
        },
        {
          text: __("Glyph"),
          dataIndex: "name",
          flex: 1,
          renderer: (value) => `<i class="gf ${value}"></i>`,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: __("Name"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: __("UUID"),
          allowBlank: true,
        },
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: __("Code (HEX)"),
          emptyText: __("Enter HEX number"),
          allowBlank: false,
          regex: /^[0-9a-fA-F]+$/,
          invalidText: __("Invalid HEX format"),
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
          fieldLabel: __("Preview"),
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
