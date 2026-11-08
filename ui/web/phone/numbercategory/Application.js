//---------------------------------------------------------------------
// phone.numbercategory application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.phone.numbercategory.Application");

Ext.define("NOC.phone.numbercategory.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.phone.numbercategory.Model",
    "NOC.phone.dialplan.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.phone.numbercategory.Model",
  search: true,
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-order"),
          dataIndex: "order",
          width: 50,
          align: "right",
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
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-is-active"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: false,
        },
        {
          name: "order",
          xtype: "numberfield",
          fieldLabel: t("header-order"),
          uiStyle: "small",
        },
        {
          name: "rules",
          xtype: "gridfield",
          fieldLabel: t("header-rules"),
          columns: [
            {
              text: t("app-title-dialplan"),
              dataIndex: "dialplan",
              width: 100,
              renderer: NOC.render.Lookup("dialplan"),
              editor: "phone.dialplan.LookupField",
            },
            {
              text: t("header-mask"),
              dataIndex: "mask",
              width: 200,
              editor: "textfield",
            },
            {
              text: t("header-is-active"),
              dataIndex: "is_active",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              flex: 1,
              editor: "textfield",
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
