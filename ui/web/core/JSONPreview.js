//---------------------------------------------------------------------
// NOC.core.JSONPreview monaco editor
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.core.JSONPreview");

Ext.define("NOC.core.JSONPreview", {
  extend: "NOC.core.MonacoPanel",
  requires: [
    "NOC.core.ShareWizard",
  ],
  app: null,
  restUrl: null,
  previewName: null,
  config: {
    saveDisabled: false,
    shareDisabled: false,
  },
  initComponent: function(){
    this.tbar = [
      {
        itemId: "close",
        text: t("btn-close"),
        glyph: NOC.glyph.arrow_left,
        handler: "onBack",
      },
      "-",
      {
        itemId: "save",
        text: t("btn-save"),
        glyph: NOC.glyph.save,
        disabled: this.saveDisabled,
        handler: "onSave",
      },
      "-",
      {
        text: t("btn-share"),
        glyph: NOC.glyph.share,
        disabled: this.shareDisabled,
        handler: "onShare",
      },
    ];
    // setup editor language
    this.items[0].language = "json";
    this.callParent();
  },
  onShare: function(){
    Ext.Msg.show({
      title: t("app-title-share-item"),
      msg: t("msg-would-you-like-to-share-item-and-contribute-to-open-source-proje"),
      buttons: Ext.Msg.YESNO,
      modal: true,
      scope: this,
      fn: function(button){
        if(button === "yes"){
          this.doShare()
        }
      },
    })
  },
  onSave: function(){
    var restUrl = this.restUrl.replace("{0}", this.currentRecord.get("id")) 
    NOC.api.requestLegacy({
      url: restUrl,
      method: "POST",
      scope: this,
      success: function(){
        NOC.info(t("msg-json-saved"));
      },
      failure: function(){
        NOC.error(t("msg-failed-to-save-json"))
      },
    });
  },
  doShare: function(){
    var restUrl = this.restUrl.replace("{0}", this.currentRecord.get("id")).replace("/json/", "/share_info/"),
      wizard = Ext.create("NOC.core.ShareWizard", {
        restUrl: restUrl,
      });
    wizard.startProcess();
  },
});