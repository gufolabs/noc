//---------------------------------------------------------------------
// main.userprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.userprofile.Application");

Ext.define("NOC.main.userprofile.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ComboBox",
    "NOC.main.timepattern.LookupField",
    "NOC.main.userprofile.UserProfileContacts",
    "NOC.main.userprofile.UserProfileNotificationGroups",
  ],
  layout: "fit",
  items: [
    {
      xtype: "form",
      scrollable: "y",
      defaults: {
        padding: "0 0 0 4px",
        xtype: "displayfield",
      },
      items: [
        {
          fieldLabel: t("header-login"),
          name: "username",
        },
        {
          fieldLabel: t("app-title-group"),
          name: "groups",
        },
        {
          fieldLabel: t("header-name"),
          name: "name",
        },
        {
          fieldLabel: t("label-mail"),
          name: "email",
        },
        {
          xtype: "fieldset",
          title: t("app-title-notification-contacts"),
          border: false,
          items: [
            {
              xtype: "userprofilecontacts",
              name: "contacts",
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-notification-group-settings"),
          border: false,
          items: [
            {
              xtype: "userprofilenotification",
            },
          ],
        },
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            {
              glyph: NOC.glyph.save,
              text: t("btn-save"),
              handler: function(){
                this.up("[appId=main.userprofile]").onSave();
              },
            },
          ],
        },
      ],
    },
  ],
  //
  initComponent: function(){
    this.callParent();
    this.loadData();
    this.setHistoryHash();
  },
  //
  loadData: function(){
    NOC.api.requestLegacy({
      url: "/main/userprofile/",
      method: "GET",
      scope: this,
      success: function(response){
        var data = Ext.decode(response.responseText);
        data.group = (data.groups || []).join(", ");
        this.down("form").getForm().setValues(data);
        // load notification Group Settings grid
        this.down("form userprofilenotification").getStore().loadData(data.subscription_settings);
      },
      failure: function(){
        NOC.msg.failed(t("msg-failed-to-load-data"))
      },
    });
  },
  //
  onSave: function(){
    var contactsField = this.down("fieldset [name=contacts]"),
      data = {
        contacts: contactsField.getValue(),
      };
    NOC.api.requestLegacy({
      url: "/main/userprofile/",
      method: "POST",
      scope: this,
      jsonData: data,
      success: function(){
        NOC.msg.complete(t("msg-profile-saved"));
      },
      failure: function(response){
        var message = Ext.decode(response.responseText);
        NOC.msg.failed(message.errors || t("msg-failed-to-save"));
      },
    });
  },
});
