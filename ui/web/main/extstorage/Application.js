//---------------------------------------------------------------------
// main.extstorage application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.extstorage.Application");

Ext.define("NOC.main.extstorage.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.extstorage.Model",
  ],
  model: "NOC.main.extstorage.Model",
  search: true,

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: "Name",
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-proto"),
          dataIndex: "url",
          width: 100,
          renderer: function(value){
            var i = value.indexOf("://");
            if(i === -1){
              return "OSFS"
            } else{
              return value.substring(0, i)
            }
          },
        },
        {
          text: t("header-type"),
          dataIndex: "type",
          width: 120,
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
          name: "url",
          xtype: "textfield",
          fieldLabel: t("header-url"),
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          allowBlank: false,
          store: [
            ["config_mirror", t("msg-config-mirror")],
            ["config_upload", t("msg-config-upload")],
            ["beef", t("msg-beef")],
            ["beef_test", t("msg-beef-test")],
            ["beef_test_config", t("msg-beef-test-config")],
          ],
          uiStyle: "medium",
        },
      ],
    });
    me.callParent();
  },
});
