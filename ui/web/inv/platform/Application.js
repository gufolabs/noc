//---------------------------------------------------------------------
// inv.platform application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.platform.Application");

Ext.define("NOC.inv.platform.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.label.LabelField",
    "NOC.inv.platform.Model",
    "NOC.inv.vendor.LookupField",
  ],
  model: "NOC.inv.platform.Model",
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
      restUrl: "/inv/platform/{0}/json/",
      previewName: "Platform: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-vendor"),
          dataIndex: "vendor",
          width: 150,
          renderer: NOC.render.Lookup("vendor"),
        },
        {
          text: t("app-title-platform"),
          dataIndex: "full_name",
          width: 200,
        },
        {
          text: t("header-aliases"),
          dataIndex: "aliases",
          flex: 1,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          width: 30,
          renderer: NOC.render.Bool,
          sortable: false,
        },
        {
          text: t("header-sysobjectid"),
          dataIndex: "snmp_sysobjectid",
          width: 200,
        },
        {
          text: t("header-start-of-sale"),
          dataIndex: "start_of_sale",
          width: 150,
        },
        {
          text: t("header-end-of-sale"),
          dataIndex: "end_of_sale",
          width: 150,
        },
        {
          text: t("header-end-of-support"),
          dataIndex: "end_of_support",
          width: 150,
        },
        {
          text: t("header-end-of-extended-support"),
          dataIndex: "end_of_xsupport",
          width: 150,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          width: 100,
          renderer: NOC.render.LabelField,
        },
      ],

      fields: [
        {
          name: "vendor",
          xtype: "inv.vendor.LookupField",
          fieldLabel: t("app-title-platform"),
          allowBlank: false,
        },
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
          name: "aliases",
          xtype: "tagsfield",
          fieldLabel: t("header-aliases"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-group-support"),
          items: [
            {
              name: "start_of_sale",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("header-start-of-sale"),
              allowBlank: true,
              uiStyle: "medium",
              format: "Y-m-d",
            },
            {
              name: "end_of_sale",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("header-end-of-sale"),
              allowBlank: true,
              uiStyle: "medium",
              format: "Y-m-d",
            },
            {
              name: "end_of_support",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("header-end-of-support"),
              allowBlank: true,
              uiStyle: "medium",
              format: "Y-m-d",
            },
            {
              name: "end_of_xsupport",
              xtype: "datefield",
              startDay: 1,
              fieldLabel: t("header-end-of-extended-support"),
              allowBlank: true,
              uiStyle: "medium",
              format: "Y-m-d",
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-snmp-oid"),
          items: [
            {
              name: "snmp_sysobjectid",
              xtype: "textfield",
              fieldLabel: "sysObjectID.0",
              allowBlank: true,
              regex: /^1.3.6(\.\d+)+$/,
              uiStyle: "large",
            },
          ],
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "enable_platform": true,
          },
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
        "/api/card/view/platform/" + me.currentRecord.get("id") + "/",
      );
    }
  },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
