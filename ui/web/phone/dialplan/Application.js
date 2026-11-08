//---------------------------------------------------------------------
// phone.dialplan application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.phone.dialplan.Application");

Ext.define("NOC.phone.dialplan.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.phone.dialplan.Model",
  ],
  model: "NOC.phone.dialplan.Model",
  search: true,
  helpId: "reference-dialplan",

  initComponent: function(){
    var me = this;

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("header-mask"),
          dataIndex: "mask",
          width: 150,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "mask",
          xtype: "textfield",
          fieldLabel: t("header-mask"),
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
      ],

      formToolbar: [
        me.cardButton,
      ],
    });
    me.callParent();
  },

  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/dialplan/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
