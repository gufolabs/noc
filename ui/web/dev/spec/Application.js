//---------------------------------------------------------------------
// dev.spec application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.dev.spec.Application");

Ext.define("NOC.dev.spec.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.ListFormField",
    "NOC.dev.spec.Model",
    "NOC.dev.quiz.LookupField",
    "NOC.sa.profile.LookupField",
  ],
  model: "NOC.dev.spec.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/dev/spec/{0}/json/",
      previewName: "Spec: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("app-title-quiz"),
          dataIndex: "quiz",
          width: 150,
          renderer: NOC.render.Lookup("quiz"),
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
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
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: false,
        },
        {
          name: "revision",
          xtype: "numberfield",
          fieldLabel: t("header-revision"),
          allowBlank: false,
          minValue: 1,
          uiStyle: "small",
        },
        {
          name: "quiz",
          xtype: "dev.quiz.LookupField",
          fieldLabel: t("app-title-quiz"),
          allowBlank: false,
        },
        {
          name: "profile",
          xtype: "sa.profile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "author",
          xtype: "textfield",
          fieldLabel: t("label-author"),
          allowBlank: false,
        },
        {
          name: "changes",
          xtype: "listform",
          fieldLabel: t("msg-changes"),
          items: [
            {
              name: "date",
              xtype: "textfield",
              fieldLabel: t("header-date"),
              allowBlank: false,
              uiStyle: "medium",
            },
            {
              name: "changes",
              xtype: "textarea",
              fieldLabel: t("msg-changes"),
              allowBlank: false,
              uiStyle: "extra",
            },
          ],
        },
        {
          name: "answers",
          xtype: "listform",
          fieldLabel: t("label-answers"),
          allowBlank: false,
          items: [
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              allowBlank: false,
              uiStyle: "medium",
            },
            {
              name: "type",
              xtype: "combobox",
              fieldLabel: t("header-type"),
              allowBlank: false,
              uiStyle: "medium",
              store: [
                ["str", "str"],
                ["bool", "bool"],
                ["int", "int"],
                ["cli", "cli"],
                ["snmp-get", "snmp-get"],
                ["snmp-getnext", "snmp-getnext"],
              ],
            },
            {
              name: "value",
              xtype: "textarea",
              fieldLabel: t("header-value"),
              allowBlank: false,
              uiStyle: "extra",
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
    });
    me.callParent();
  },

  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
