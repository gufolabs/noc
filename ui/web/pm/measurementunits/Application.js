//---------------------------------------------------------------------
// pm.measurementunits application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.measurementunits.Application");

Ext.define("NOC.pm.measurementunits.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.pm.measurementunits.Model",
    "Ext.ux.form.ColorField",
    "NOC.pm.measurementunits.LookupField"],
  model: "NOC.pm.measurementunits.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/pm/measurementunits/{0}/json/",
      previewName: "Scope: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("label-code"),
          dataIndex: "code",
          width: 100,
        },
        {
          text: t("header-base"),
          dataIndex: "base_unit",
          renderer: NOC.render.Lookup("base_unit"),
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
          name: "base_unit",
          xtype: "pm.measurementunits.LookupField",
          fieldLabel: t("label-base-measurement-units"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
          uiStyle: "extra",
        },
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "label",
          xtype: "textfield",
          fieldLabel: t("header-label"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "dashboard_label",
          xtype: "textfield",
          fieldLabel: t("label-dashboard-label"),
          uiStyle: "medium",
        },
        {
          name: "dashboard_sr_color",
          xtype: "colorfield",
          fieldLabel: t("label-dashboard-series-color"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "convert_from",
          xtype: "gridfield",
          fieldLabel: t("label-convert-form-for-baseunit"),
          allowBlank: true,
          columns: [
            {
              text: t("header-measurment-unit"),
              dataIndex: "unit",
              width: 200,
              editor: {
                xtype: "pm.measurementunits.LookupField",
              },
              renderer: NOC.render.Lookup("unit"),
            },
            {
              text: t("header-expresseion"),
              dataIndex: "expr",
              flex: 1,
              editor: "textfield",
            },
          ],
        },
        {
          name: "enum",
          xtype: "gridfield",
          fieldLabel: t("label-enumeration"),
          allowBlank: true,
          columns: [
            {
              text: t("header-key"),
              dataIndex: "key",
              width: 150,
              editor: "textfield",
            },
            {
              text: t("header-value"),
              dataIndex: "value",
              flex: 1,
              editor: "numberfield",
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
