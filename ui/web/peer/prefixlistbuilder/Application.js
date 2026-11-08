//---------------------------------------------------------------------
// peer.prefixlistbuilder application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.prefixlistbuilder.Application");

Ext.define("NOC.peer.prefixlistbuilder.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.CodeViewer",
    "NOC.peer.peeringpoint.LookupField",
    "Ext.ux.form.UCField",
  ],
  layout: {
    type: "vbox",
    align: "stretch",
  },
  border: 0,
  autoScroll: true,

  initComponent: function(){
    var me = this;

    me.form = Ext.create("Ext.form.Panel", {
      padding: 4,
      bodyPadding: 4,
      waitMsgTarget: true,
      defaults: {
        enableKeyEvents: true,
        listeners: {
          specialkey: function(field, key){
            if(field.xtype !== "textfield")
              return;
            switch(key.getKey()){
              case Ext.EventObject.ENTER:
                me.onBuild();
                break;
              case Ext.EventObject.ESC:
                me.onReset();
                break;
            }
          },
        },
        xtype: "textfield",
        msgTarget: "side",
        size: 30,
      },
      items: [
        {
          fieldLabel: t("header-name"),
          name: "name",
          emptytext: t("msg-prefix-list-name"),
          allowBlank: true,
          regex: /^[0-9a-zA-Z_-]*$/,
          invalidtext: t("msg-prefix-list-name-must-contains-only-0-9-a-z-a-z"),
        },
        {
          xtype: "peer.peeringpoint.LookupField",
          fieldLabel: t("header-peering-point"),
          name: "peering_point",
          allowBlank: false,
        },
        {
          fieldLabel: t("label-as-set"),
          name: "as_set",
          emptytext: t("msg-as-or-as-set"),
          allowBlank: false,
          regex: /^AS(\d+|-\w+)(-\w+)*(:\S+)?(\s+AS(\d+|-\w+)(:\S+)?)*$/,
          invalidtext: t("msg-enter-list-valid-asnumber-ex-as1234-or-as-sets-ex-as-megaset-as-"),
          plugins: ["ucfield"],
        },
      ],
      buttonAlign: "left",
      buttons: [
        {
          text: t("header-build"),
          itemId: "build",
          glyph: NOC.glyph.play,
          formBind: true,
          disabled: true,
          scope: me,
          handler: me.onBuild,
        },
        {
          text: t("btn-reset"),
          itemId: "reset",
          glyph: NOC.glyph.refresh,
          disabled: false,
          scope: me,
          handler: me.onReset,
        },
      ],

    });

    me.resultField = Ext.create("NOC.core.CodeViewer", {
      readOnly: true,
      flex: 1,
    });

    Ext.apply(me, {
      items: [
        me.form,
        me.resultField,
      ],
    });
    me.callParent();
  },
  //
  onBuild: function(){
    var me = this,
      form = me.form.getForm();
    if(!form.isValid()){
      return;
    }
    me.mask(t("msg-building"));
    NOC.api.requestLegacy({
      url: "/peer/prefixlistbuilder/",
      method: "GET",
      params: form.getValues(),
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        me.unmask();
        if(data.success){
          NOC.info(data.message);
          me.resultField.setValue(data.prefix_list);
        } else{
          NOC.error(data.message);
          me.resultField.setValue("")
        }
      },
      failure: function(){
        me.unmask();
        NOC.error("Failed to build prefix list");
      },
    });
  },
  onReset: function(){
    var me = this;
    me.form.getForm().reset();
  },
});
