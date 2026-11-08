//---------------------------------------------------------------------
// inv.modelinterface application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.modelinterface.Application");

Ext.define("NOC.inv.modelinterface.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.modelinterface.Model",
  search: true,
  //
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/inv/modelinterface/{0}/json/",
      previewName: "Model Interface: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);
      
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          width: 300,
          dataIndex: "name",
        },
        {
          text: t("header-builtin"),
          width: 50,
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          sortable: false,
        },
        {
          text: t("label-description"),
          flex: 1,
          dataIndex: "description",
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
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
        },
        {
          name: "attrs",
          xtype: "gridfield",
          fieldLabel: t("label-attrs"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              editor: "textfield",
            },
            {
              text: t("header-type"),
              dataIndex: "type",
              editor: {
                xtype: "combobox",
                store: [
                  "str", "strlist",
                  "int", "float", "bool",
                  "objectid", "ref",
                ],
                forceSelection: true,
              },
            },
            {
              text: t("label-description"),
              dataIndex: "description",
              editor: "textfield",
              flex: 1,
            },
            {
              text: t("header-req"),
              dataIndex: "required",
              editor: "checkboxfield",
              width: 30,
              renderer: NOC.render.Bool,
            },
            {
              text: t("header-const"),
              dataIndex: "is_const",
              editor: "checkboxfield",
              width: 30,
              renderer: NOC.render.Bool,
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
