//---------------------------------------------------------------------
// Link Register window
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.service.RegisterForm");

Ext.define("NOC.sa.service.RegisterForm", {
  extend: "Ext.Window",
  requires: [
    "NOC.core.ComboBox",
  ],
  autoShow: true,
  closable: true,
  maximizable: true,
  modal: true,
  layout: "fit",
  defaultListenerScope: true,
  title: t("app-title-register-instance"),
  items: [
    {
      xtype: "form",
      padding: 4,
      defaults: {
        labelAlign: "left",
        labelWidth: 150,
      },
      items: [
        {
          xtype: "hidden",
          name: "service_id",
        },
        {
          xtype: "core.combo",
          fieldLabel: t("header-type"),
          name: "type",
          allowBlank: false,
          editable: false,
          typeAhead: false,
          uiStyle: "medium-combo",
          hideTriggerUpdate: true,
          hideTriggerCreate: true,
        },
        {
          xtype: "textfield",
          fieldLabel: t("header-name"),
          name: "name",
        },
        {
          xtype: "textfield",
          fieldLabel: t("label-fqdn"),
          name: "fqdn",
        },
      ],
      buttons: [
        {
          text: t("btn-register"),
          formBind: true,
          handler: "buttonHandler",
        },
      ],
    },
  ],
  buttonHandler: function(){
    var data = this.down("form").getForm().getValues(),
      url = "/sa/service/" + data.service_id + "/register_instance/" + data.type + "/",
      params = {
        name: Ext.isEmpty(data.name) ? undefined : data.name,
        fqdn: Ext.isEmpty(data.fqdn) ? undefined : data.fqdn, 
      };
    this.request(url, params);
  },
  request: function(url, params){
    NOC.api.requestLegacy({
      url: url,
      method: "POST",
      jsonData: params,
      scope: this,
      success: function(response){
        var result = Ext.decode(response.responseText);
        if(result.success){
          NOC.info("Instance register successfully");
          this.instanceStore.loadRawData(result.data, true);
          this.close();
        } else{
          NOC.error("Error " + " : " + result.message || "Operation failed");
        }
      },
      failure: function(response){
        var result = Ext.decode(response.responseText);
        NOC.error("Error " + " : " + result.message || "Server error occurred");
      },
    });
  },
});