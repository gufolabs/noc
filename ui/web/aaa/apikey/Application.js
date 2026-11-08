//---------------------------------------------------------------------
// aaa.apikey application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.aaa.apikey.Application");

Ext.define("NOC.aaa.apikey.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.aaa.apikey.Model",
    "NOC.core.PasswordGenerator",
    "NOC.core.PasswordField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.aaa.apikey.Model",
  search: true,
  helpId: "reference-apikey",

  initComponent: function(){
    var me = this;
    me.keyField = Ext.create({
      name: "key",
      xtype: "password",
      fieldLabel: t("app-title-apikey"),
      allowBlank: false,
      margin: "0 5 0 0",
      maxLength: 24,
      maxLengthText: t("msg-field-max-length", {maxLength: 24}),
      minWidth: 390,
      uiStyle: "large",
    });
    me.keyGenerator = Ext.create("NOC.core.PasswordGenerator");
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        }, {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 25,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-expires"),
          dataIndex: "expires",
          flex: 1,
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
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        }, /*
                {
                    name: "expires"
                }, */
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "container",
          layout: {
            type: "hbox",
            align: "center",
          },
          margin: "0 0 5",
          items: [
            me.keyField,
            {
              xtype: "button",
              padding: "0 15 0 15",
              text: t("btn-generate-key"),
              scope: me,
              handler: me.generateKey,
            },
          ],
        },
        {
          name: "access",
          xtype: "gridfield",
          fieldLabel: t("label-access"),
          columns: [
            {
              text: t("header-api"),
              dataIndex: "api",
              width: 150,
              editor: "textfield",
            },
            {
              text: t("header-role"),
              dataIndex: "role",
              width: 150,
              editor: "textfield",
            },
          ],
        },
        {
          name: "acl",
          xtype: "gridfield",
          fieldLabel: t("label-acl"),
          columns: [
            {
              text: t("header-prefix"),
              dataIndex: "prefix",
              width: 150,
              editor: "textfield",
            },
            {
              text: t("header-active"),
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
  generateKey: function(){
    var me = this;
    me.keyField.setValue(me.keyGenerator.generate(24));
  },
});
