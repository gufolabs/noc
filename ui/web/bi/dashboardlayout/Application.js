//---------------------------------------------------------------------
// bi.dashboardlayout application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.bi.dashboardlayout.Application");

Ext.define("NOC.bi.dashboardlayout.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.bi.dashboardlayout.Model",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.bi.dashboardlayout.Model",
  initComponent: function(){
    var me = this;
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/bi/dashboardlayout/{0}/json/",
      previewName: "Vendor: {0}",
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
          name: "cells",
          xtype: "gridfield",
          fieldLabel: t("label-cells"),
          columns: [
            {
              text: t("header-name"),
              dataIndex: "name",
              editor: "textfield",
              width: 150,
            },
            {
              text: t("header-row"),
              dataIndex: "row",
              editor: "numberfield",
              width: 50,
            },
            {
              text: t("header-height"),
              dataIndex: "height",
              editor: "numberfield",
              width: 50,
            },
            {
              text: t("header-extra-small"),
              dataIndex: "xs",
              editor: "numberfield",
              width: 50,
            },
            {
              text: t("header-small"),
              dataIndex: "sm",
              editor: "numberfield",
              width: 50,
            },
            {
              text: t("header-medium"),
              dataIndex: "md",
              editor: "numberfield",
              width: 50,
            },
            {
              text: t("header-large"),
              dataIndex: "lg",
              editor: "numberfield",
              width: 50,
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
