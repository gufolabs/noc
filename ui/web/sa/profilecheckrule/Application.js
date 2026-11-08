//---------------------------------------------------------------------
// sa.profilecheckrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2015 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.profilecheckrule.Application");

Ext.define("NOC.sa.profilecheckrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.sa.profilecheckrule.Model",
    "NOC.sa.profile.LookupField",
  ],
  model: "NOC.sa.profilecheckrule.Model",
  search: true,
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/sa/profilecheckrule/{0}/json/",
      previewName: "Profile Check Rule: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-profile-check-rule-name"),
          dataIndex: "name",
          width: 200,
        },
        {
          text: t("header-blt"),
          // tooltip: "Built-in", - broken in ExtJS 5.1
          dataIndex: "is_builtin",
          width: 40,
          renderer: NOC.render.Bool,
          align: "center",
        },
        {
          text: t("header-pref-2"),
          // tooltip: "Preference", - broken in ExtJS 5.1
          dataIndex: "preference",
          width: 40,
          align: "right",
        },
        {
          text: t("header-method"),
          dataIndex: "method",
          width: 100,
        },
        {
          text: t("header-parameter"),
          dataIndex: "param",
          width: 180,
        },
        {
          text: t("app-title-match"),
          dataIndex: "match_method",
          width: 50,
          align: "center",
        },
        {
          text: t("header-value"),
          dataIndex: "value",
          width: 200,
        },
        {
          text: t("app-title-action"),
          dataIndex: "action",
          width: 50,
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          flex: 1,
          width: 150,
          renderer: NOC.render.Lookup("profile"),
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
          xtype: "displayfield",
          name: "uuid",
          fieldLabel: t("label-uuid"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
        },
        {
          name: "preference",
          xtype: "numberfield",
          fieldLabel: t("label-preference"),
          allowBlank: true,
          uiStyle: "small",
        },
        {
          xtype: "fieldset",
          title: t("app-title-match"),
          layout: "hbox",
          items: [
            {
              xtype: "container",
              flex: 1,
              layout: {
                type: "vbox",
                align: "stretch",
              },
              items: [
                {
                  layout: {
                    type: "hbox",
                    align: "stretch",
                  },
                  defaults: {
                    labelAlign: "top",
                    padding: "0 4px",
                  },
                  items: [
                    {
                      name: "method",
                      xtype: "combobox",
                      fieldLabel: t("header-method"),
                      store: [
                        ["snmp_v2c_get", "snmp_v2c_get"],
                        ["http_get", "http_get"],
                        ["https_get", "https_get"],
                      ],
                      queryMode: "local",
                      editable: false,
                      allowBlank: false,
                      uiStyle: "medium",
                      listeners: {
                        change: function(){
                          var formPanel = this.up("form");
                          if(!formPanel){
                            return;
                          }
                          var f = formPanel.getForm();
                          var valueField = f.findField("value");
                          if(valueField){
                            valueField.validate();
                          }
                        },
                      },
                    },
                    {
                      name: "param",
                      xtype: "textfield",
                      fieldLabel: t("header-parameter"),
                      allowBlank: false,
                      flex: 1,
                    },
                  ],
                },
                {
                  layout: "hbox",
                  defaults: {
                    labelAlign: "top",
                    padding: "0 4px",
                  },
                  items: [
                    {
                      name: "match_method",
                      xtype: "combobox",
                      fieldLabel: t("app-title-match"),
                      store: [
                        ["eq", "equals"],
                        ["contains", "contains"],
                        ["re", "regexp"],
                      ],
                      queryMode: "local",
                      editable: false,
                      uiStyle: "medium",
                      allowBlank: false,
                    },
                    {
                      name: "value",
                      xtype: "textfield",
                      fieldLabel: t("header-value"),
                      allowBlank: false,
                      flex: 1,
                      validator: function(v){
                        var formPanel = this.up("form");
                        if(!formPanel){
                          return true;
                        }
                        var f = formPanel.getForm();
                        var methodField = f.findField("method");
                        var method = methodField ? methodField.getValue() : null;

                        if(method === "snmp_v2c_get"){
                          var oidRe = /^\.?\d+(?:\.\d+)*$/;
                          if(!oidRe.test((v || "").trim())){
                            return t("msg-for-snmp-v2c-get-value-must-be-a-valid-oid-e-g-1-3-6-1-2-1");
                          }
                        }
                        return true;
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-action"),
          layout: "hbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "action",
              xtype: "combobox",
              fieldLabel: t("app-title-action"),
              store: [
                ["match", "Match"],
                ["maybe", "Maybe"],
              ],
              queryMode: "local",
              editable: false,
              uiStyle: "medium",
              allowBlank: false,
            },
            {
              name: "profile",
              xtype: "sa.profile.LookupField",
              fieldLabel: t("header-profile"),
              allowBlank: false,
              uiStyle: "medium",
            },
          ],
        },
      ],
      formToolbar: [
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
      ],
    });
    me.callParent();
  },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
