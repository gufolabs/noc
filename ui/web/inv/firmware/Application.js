//---------------------------------------------------------------------
// inv.firmware application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.firmware.Application");

Ext.define("NOC.inv.firmware.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.inv.firmware.Model",
    "NOC.inv.vendor.LookupField",
    "NOC.sa.profile.LookupField",
  ],
  model: "NOC.inv.firmware.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/firmware/{0}/json/",
      previewName: "Firmware: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-profile"),
          dataIndex: "profile",
          width: 100,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-vendor"),
          dataIndex: "vendor",
          width: 100,
          renderer: NOC.render.Lookup("vendor"),
        },
        {
          text: t("header-version"),
          dataIndex: "version",
          flex: 1,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          width: 30,
          renderer: NOC.render.Bool,
          sortable: false,
        },
      ],

      fields: [
        {
          name: "profile",
          xtype: "sa.profile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "vendor",
          xtype: "inv.vendor.LookupField",
          fieldLabel: t("header-vendor"),
          allowBlank: false,
        },
        {
          name: "version",
          xtype: "textfield",
          fieldLabel: t("header-version"),
          allowBlank: false,
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "download_url",
          xtype: "textfield",
          fieldLabel: t("header-url"),
          allowBlank: true,
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

      filters: [
        {
          title: t("choice-by-profile"),
          name: "profile",
          ftype: "lookup",
          lookup: "sa.profile",
        },
        {
          title: t("app-title-by-vendor"),
          name: "vendor",
          ftype: "lookup",
          lookup: "inv.vendor",
        },
      ],
    });
    me.callParent();
  },

  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/firmware/" + me.currentRecord.get("id") + "/",
      );
    }
  },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
