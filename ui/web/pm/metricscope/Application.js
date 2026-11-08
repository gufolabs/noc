//---------------------------------------------------------------------
// pm.metricscope application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.metricscope.Application");

Ext.define("NOC.pm.metricscope.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.pm.metricscope.Model",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.pm.metricscope.Model",
  search: true,
  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/pm/metricscope/{0}/json/",
      previewName: "Scope: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: "Name",
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
          name: "table_name",
          xtype: "textfield",
          fieldLabel: t("header-table"),
          allowBlank: false,
          uiStyle: "medium",
          regex: /[a-zA-Z][0-9a-zA-Z_]*/,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "key_fields",
          xtype: "gridfield",
          fieldLabel: t("label-key-fields"),
          allowBlank: false,
          columns: [
            {
              dataIndex: "field_name",
              text: t("btn-field"),
              width: 150,
              editor: "textfield",
            },
            {
              dataIndex: "model",
              text: t("header-model"),
              flex: 1,
              editor: "textfield",
            },
          ],
        },
        {
          name: "labels",
          xtype: "gridfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          columns: [
            {
              dataIndex: "label",
              text: t("header-label"),
              width: 150,
              editor: "textfield",
            },
            {
              dataIndex: "is_required",
              text: t("header-required"),
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              dataIndex: "is_key_label",
              text: t("header-include-key-label"),
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              dataIndex: "is_primary_key",
              text: t("header-primary-key"),
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              dataIndex: "is_order_key",
              text: t("header-order-key"),
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              dataIndex: "is_path",
              text: t("header-path"),
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
            {
              dataIndex: "store_column",
              text: t("header-store-column"),
              flex: 1,
              editor: "textfield",
            },
            {
              dataIndex: "view_column",
              text: t("header-view-column"),
              flex: 1,
              editor: "textfield",
            },
          ],
        },
        {
          name: "enable_timedelta",
          xtype: "checkbox",
          boxLabel: t("label-enable-time-delta-require-migration"),
          tooltip: t("help-required-run-migration-metric-database-after-changed-that-enable"),
          disabled: true,
          listeners: {
            render: me.addTooltip,
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
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
