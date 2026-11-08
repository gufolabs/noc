//---------------------------------------------------------------------
// inv.technology application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.technology.Application");

Ext.define("NOC.inv.technology.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.inv.technology.Model",
    "NOC.main.ref.modelid.LookupField",
  ],
  model: "NOC.inv.technology.Model",
  search: true,
  helpId: "reference-technology",

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/technology/{0}/json/",
      previewName: "Technology: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

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
          width: 150,
        },
        {
          text: t("header-service-model"),
          dataIndex: "service_model",
          width: 150,
        },
        {
          text: t("header-client-model"),
          dataIndex: "client_model",
          width: 150,
        },
        {
          text: t("header-single-service"),
          dataIndex: "single_service",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-single-client"),
          dataIndex: "single_client",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-allow-children"),
          dataIndex: "allow_children",
          width: 50,
          renderer: NOC.render.Bool,
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
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "service_model",
          xtype: "main.ref.modelid.LookupField",
          fieldLabel: t("header-service-model"),
          allowBlank: true,
        },
        {
          name: "client_model",
          xtype: "main.ref.modelid.LookupField",
          fieldLabel: t("header-client-model"),
          allowBlank: true,
        },
        {
          name: "single_service",
          xtype: "checkbox",
          boxLabel: t("header-single-service"),
        },
        {
          name: "single_client",
          xtype: "checkbox",
          boxLabel: t("header-single-client"),
        },
        {
          name: "allow_children",
          xtype: "checkbox",
          boxLabel: t("header-allow-children"),
        },
      ],
      formToolbar: [
        me.cardButton,
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-show-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
      ],
    });
    me.callParent();
  },
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/technology/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
