//---------------------------------------------------------------------
// main.desktop.ChangePassword
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.desktop.ChangePassword");

Ext.define("NOC.main.desktop.ChangePassword", {
  extend: "Ext.window.Window",
  xtype: "changePassword",
  autoShow: true,
  closable: false,
  resizable: false,
  title: t("app-title-change-password"),
  layout: "fit",
  modal: true,
  defaultListenerScope: true,
  defaultFocus: "oldPass",
  defaultButton: "changeButton",
  referenceHolder: true,
  width: 500,
  height: 310,
  viewModel: "default",
  items: {
    xtype: "form",
    reference: "changePasswordForm",
    fixed: true,
    border: false,
    bodyStyle: {
      background: "#e0e0e0",
      padding: "20px",
    },
    defaults: {
      anchor: "100%",
      allowBlank: false,
      enableKeyEvents: true,
      xtype: "textfield",
      inputType: "password",
    },
    layout: {
      type: "vbox",
      align: "stretch",
      pack: "center",
    },
    items: [
      {
        itemId: "oldPass",
        name: "oldPass",
        bind: "{oldPass}",
        fieldLabel: t("label-old-password"),
        blankText: t("label-old-password-cannot-be-empty"),
      },
      {
        itemId: "newPass",
        name: "newPass",
        bind: "{newPass}",
        fieldLabel: t("label-new-password"),
        blankText: t("label-new-password-cannot-be-empty"),
      },
      {
        itemId: "confirmPass",
        name: "confirmPass",
        bind: "{confirmPass}",
        fieldLabel: t("label-confirm-new-password"),
        blankText: t("label-please-confirm-your-new-password"),
        validator: function(value){
          var newPass = this.up("form").down("#newPass").getValue();
          return value === newPass ? true : t("msg-passwords-do-not-match");
        },
      },
    ],
    buttons: [
      {
        reference: "changeButton",
        formBind: true,
        handler: "onChangeClick",
        text: t("header-change"),
        glyph: "xf090@FontAwesome",
      },
    ],
  },
  onChangeClick: function(field){
    var panel = field.up("form"),
      form = panel.getForm();
    if(form.isValid()){
      panel.setDisabled(true);
      NOC.api.requestLegacy({
        url: "/api/login/change_credentials",
        method: "PUT",
        scope: this,
        jsonData: {
          user: this.username,
          old_password: form.findField("oldPass").getValue(),
          new_password: form.findField("newPass").getValue(),
        },
        success: function(response){
          var data = Ext.decode(response.responseText);
          if(data.status){
            NOC.msg.complete(t("msg-password-changed"));
            panel.close();
            this.applicationOpen();
          } else{
            NOC.error(t("msg-failed-to-change-credentials-value0-3", {value0: data.message}));
          }
        },
        failure: function(){
          NOC.error(t("msg-error-changing-password"));
        },
        callback: function(){
          panel.setDisabled(false);
        },
      });
    }
  },
  applicationOpen: function(){
    var param = Ext.urlDecode(location.search);
    if("uri" in param){
      if(location.hash){ // web app
        location = "/" + location.hash;
      } else{ // cards
        location = param.uri;
      }
    }
  },
});