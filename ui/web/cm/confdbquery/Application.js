//---------------------------------------------------------------------
// cm.confdbquery application
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.cm.confdbquery.Application");

Ext.define("NOC.cm.confdbquery.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.CodeViewer",
    "NOC.core.JSONPreview",
    "NOC.cm.confdbquery.Model",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.cm.confdbquery.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/cm/confdbquery/{0}/json/",
      previewName: "ConfDB Query: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 350,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          labelAlign: "top",
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "uuid",
          xtype: "displayfield",
          fieldLabel: t("label-uuid"),
          labelAlign: "top",
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          labelAlign: "top",
          allowBlank: true,
        },
        {
          name: "params",
          xtype: "gridfield",
          fieldLabel: t("label-parameters"),
          labelAlign: "top",
          columns: [
            {
              dataIndex: "name",
              text: t("header-name"),
              editor: "textfield",
              width: 150,
            },
            {
              dataIndex: "type",
              text: t("header-type"),
              width: 70,
              editor: {
                xtype: "combobox",
                store: [
                  ["str", "str"],
                  ["int", "int"],
                  ["bool", "bool"],
                  ["ip", "IP"],
                ],
              },
            },
            {
              dataIndex: "default",
              text: t("header-default"),
              editor: "textfield",
              width: 200,
            },
            {
              dataIndex: "description",
              text: t("label-description"),
              editor: "textfield",
              flex: 1,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-allow"),
          layout: "hbox",
          defaults: {
            padding: 4,
          },
          items: [
            {
              name: "allow_object_filter",
              xtype: "checkbox",
              boxLabel: t("label-object-filter"),
            },
            {
              name: "allow_object_validation",
              xtype: "checkbox",
              boxLabel: t("label-object-validation"),
            },
            {
              name: "allow_interface_filter",
              xtype: "checkbox",
              boxLabel: t("label-interface-filter"),
            },
            {
              name: "allow_interface_validation",
              xtype: "checkbox",
              boxLabel: t("label-interface-validation"),
            },
          ],
        },
        {
          name: "require_raw",
          xtype: "checkbox",
          boxLabel: "Require raw",
        },
        {
          name: "source",
          xtype: "codeviewer",
          fieldLabel: t("header-source"),
          labelAlign: "top",
          allowBlank: false,
          height: 400,
          // codeviewer config
          language: "python",
          readOnly: false,
          automaticLayout: true,
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
