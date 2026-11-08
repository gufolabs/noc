//---------------------------------------------------------------------
// inv.resourcepool application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.resourcepool.Application");

Ext.define("NOC.inv.resourcepool.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.resourcepool.Model",
  ],
  model: "NOC.inv.resourcepool.Model",
  search: true,
  helpId: "reference-allocation-group",

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
          text: "Name",
          dataIndex: "name",
          flex: 150,
        },
        {
          text: "Type",
          dataIndex: "type",
          flex: 100,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
          uiStyle: "large",
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          allowBlank: false,
          uiStyle: "medium",
          store: [
            ["ip", "IP"],
            ["vlan", "VLAN"],
          ],
        },
        {
          name: "is_unique",
          xtype: "checkbox",
          boxLabel: t("label-unique-resource"),
        },
        {
          name: "strategy",
          xtype: "combobox",
          fieldLabel: t("label-allocate-strategy"),
          value: "F",
          uiStyle: "medium",
          store: [
            ["F", "First"],
            ["L", "Last"],
            ["R", "Random"],
          ],
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("header-api"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "api_code",
              xtype: "textfield",
              fieldLabel: t("label-api-code"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "api_role",
              xtype: "textfield",
              fieldLabel: t("label-api-role"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
      ],
      formToolbar: [
        me.cardButton,
      ],
    });
    me.callParent();
  },

  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/resourcepool/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});