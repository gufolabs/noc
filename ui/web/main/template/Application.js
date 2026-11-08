//---------------------------------------------------------------------
// main.template application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.template.Application");

Ext.define("NOC.main.template.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.template.Model",
    "NOC.main.ref.messagetype.LookupField",
    "NOC.main.ref.ulanguage.LookupField",
    "NOC.core.JSONPreview",
  ],
  model: "NOC.main.template.Model",
  search: true,
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/main/template/{0}/json/",
      previewName: "Template: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 120,
        },
        {
          text: t("btn-system"),
          dataIndex: "is_system",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 30,
        },
        {
          text: t("header-subject"),
          dataIndex: "subject",
          flex: 1,
        },
      ],
      fields: [
        {
          xtype: "container",
          layout: "hbox",
          items: [
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
              style: "padding-left: 10px",
              fieldLabel: t("label-uuid"),
            },
            {
              name: "is_system",
              xtype: "checkbox",
              boxLabel: t("btn-system"),
              disabled: true,
            },
          ],
        },
        {
          name: "message_type",
          xtype: "main.ref.messagetype.LookupField",
          fieldLabel: t("header-message-type"),
          //labelAlign: "left",
          allowBlank: true,
        },
        {
          xtype: "core.combo",
          restUrl: "/main/ref/ulanguage/lookup/",
          fieldLabel: t("header-language"),
          allowBlank: false,
          typeAhead: false,
          editable: false,
          uiStyle: "medium-combo",
          name: "language",
        },
        {
          name: "subject",
          xtype: "textareafield",
          fieldLabel: t("header-subject"),
          allowBlank: false,
          anchor: "100%",
          height: 100,
          fieldStyle: {
            fontFamily: "Courier",
          },
        },
        {
          name: "body",
          xtype: "textareafield",
          fieldLabel: t("header-body"),
          allowBlank: true,
          anchor: "100%",
          height: 200,
          fieldStyle: {
            fontFamily: "Courier",
          },
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

  filters: [ ],
});
