//---------------------------------------------------------------------
// dev.quiz application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.dev.quiz.Application");

Ext.define("NOC.dev.quiz.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.ListFormField",
    "NOC.core.JSONPreview",
    "NOC.dev.quiz.Model",
  ],
  model: "NOC.dev.quiz.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/dev/quiz/{0}/json/",
      previewName: "Quiz: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
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
          name: "disclaimer",
          xtype: "textarea",
          fieldLabel: t("label-disclaimer"),
          allowBlank: true,
        },
        {
          name: "questions",
          xtype: "listform",
          fieldLabel: t("label-questions"),
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
              name: "question",
              xtype: "textarea",
              fieldLabel: t("label-question"),
              allowBlank: false,
              uiStyle: "extra",
            },
            {
              name: "when",
              xtype: "textfield",
              fieldLabel: t("label-when"),
              allowBlank: true,
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

  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
