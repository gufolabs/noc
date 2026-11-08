//---------------------------------------------------------------------
// Link ManagedObject window
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.service.ManagedObjectLinkForm");

Ext.define("NOC.sa.service.ManagedObjectLinkForm", {
  extend: "Ext.Window",
  requires: [
    "NOC.core.ComboBox",
  ],
  autoShow: true,
  closable: true,
  maximizable: true,
  modal: true,
  scrollable: true,
  layout: "fit",
  defaultListenerScope: true,
  initComponent: function(){
    Ext.apply(this, {
      items: [
        {
          xtype: "form",
          padding: 4,
          items: [
            {
              xtype: "hidden",
              name: "service_id",
              value: this.service_id,
            },
            {
              xtype: "hidden",
              name: "instance_id",
              value: this.instance_id,
            },
            {
              fieldLabel: t("header-managed-object-62561c"),
              labelAlign: "left",
              labelWidth: 150,
              name: "managed_id",
              value: this.managed_id,
              allowBlank: false,
              xtype: "core.combo",
              restUrl: "/sa/managedobject/lookup/",
              uiStyle: "medium-combo",
              hideTriggerUpdate: true,
              hideTriggerCreate: true,
            },
          ],
          buttons: [
            {
              text: t("btn-bind"),
              formBind: true,
              handler: "buttonBindHandler",
            },
            {
              text: t("btn-unbind"),
              handler: "buttonResetHandler",
            },
          ],
        },
      ],
    });
    this.callParent();
  },
  buttonBindHandler: function(){
    this.buttonHandler("bind")
  },
  buttonResetHandler: function(){
    this.buttonHandler("unbind");
  },
  buttonHandler: function(method){
    var data = this.down("form").getForm().getValues(),
      url = "/sa/service/" + data.service_id + "/instance/" + data.instance_id + "/" + method,
      params = {managed_object: data.managed_id};
    if(method !== "bind"){
      url += "/managed_object/";
      params = undefined;
    }
    this.request(url, params, method);
  },
  request: function(url, params, method){
    NOC.api.requestLegacy({
      url: url,
      method: "PUT",
      jsonData: params,
      success: function(response){
        var result = Ext.decode(response.responseText);
        if(result.success){
          this.instanceRecord.set("managed_object", result.data.managed_object);
          this.instanceRecord.set("managed_object__label", result.data.managed_object__label);
          this.instanceRecord.commit();
          NOC.info(t("msg-managed-object-value0-successfully", {value0: method}));
          this.close();
        } else{
          NOC.error(t("msg-error-value0-7", {value0: result.message}) || t("msg-operation-failed"));
        }
      },
      failure: function(){
        NOC.error("Error : Server error occurred");
      },
      scope: this,
    });
  },
});