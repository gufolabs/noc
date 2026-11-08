//---------------------------------------------------------------------
// Integration fieldset
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.core.IntegrationField");
Ext.define("NOC.core.IntegrationField", {
  extend: "Ext.form.FieldSet",
  xtype: "noc.integrationfield",
  layout: "hbox",
  title: t("app-title-integration"),
  defaults: {
    padding: 4,
    labelAlign: "left",
  },
  items: [
    {
      name: "remote_system",
      xtype: "main.remotesystem.LookupField",
      fieldLabel: t("app-title-remotesystem"),
      labelWidth: 150,
      allowBlank: true,
    },
    {
      name: "remote_id",
      xtype: "textfield",
      fieldLabel: t("label-remote-id"),
      labelWidth: 175,
      width: 330,
      allowBlank: true,
    },
    {
      name: "bi_id",
      xtype: "displayfield",
      fieldLabel: t("label-bi-id"),
      labelWidth: 50,
      allowBlank: true,
      uiStyle: "medium",
      renderer: function(value){
        if(!value){
          return "";
        }
        return value + NOC.clipboardIcon(value);
      },
    },
  ],
});