//---------------------------------------------------------------------
// MIB Upload Form
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.mib.MIBUpload");

Ext.define("NOC.fm.mib.MIBUpload", {
  extend: "Ext.Window",
  autoShow: true,
  modal: true,
  app: undefined,
  title: "Upload MIB",
  layout: "fit",

  initComponent: function(){
    var me = this;
    me.uploadFiles = [];
    for(var i = 0; i < 5; i++){
      me.uploadFiles.push(
        Ext.create("Ext.form.field.File", {
          name: "mib_" + i,
          fieldLabel: t("msg-mib-value0", {value0: i}),
          labelWidth: 50,
          width: 400,
          buttontext: t("label-select-mib"),
        }),
      );
    }
    me.form = Ext.create("Ext.form.Panel", {
      items: me.uploadFiles,
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "bottom",
          items: [
            {
              text: t("btn-upload"),
              glyph: NOC.glyph.upload,
              scope: me,
              handler: me.onUpload,
            },
          ],
        },
      ],
    });

    Ext.apply(me, {
      items: [
        me.form,
      ],
    });
    me.callParent();
  },

  onUpload: function(){
    var me = this,
      form = me.form.getForm();
    if(form.isValid()){
      form.submit({
        url: "/fm/mib/upload/",
        waitMsg: "Uploading MIBs...",
        success: function(){
          NOC.info(t("msg-mibs-has-been-uploaded"));
          me.close();
        },
        failure: function(arg1, arg2){
          var message = t("msg-failed-to-upload-mib");
          var _arg2 = Ext.decode(arg2.response.responseText);
          if(_arg2 && _arg2.message){
            message = _arg2.message;
          }
          NOC.error(message);
        },
      });
    }
  },
});
