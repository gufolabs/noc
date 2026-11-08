//---------------------------------------------------------------------
// main.metricstream application
//---------------------------------------------------------------------
// Copyright (C) 2007-2023 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.metricstream.Application");

Ext.define("NOC.main.metricstream.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.main.metricstream.Model",
    "NOC.pm.metricscope.LookupField",
    "NOC.pm.metrictype.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.main.metricstream.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-scope"),
          dataIndex: "scope",
          width: 200,
          renderer: NOC.render.Lookup("scope"),
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          width: 25,
          renderer: NOC.render.Bool,
        },
      ],

      fields: [
        {
          name: "scope",
          xtype: "pm.metricscope.LookupField",
          fieldLabel: t("header-scope"),
          allowBlank: false,
        },
        {
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "fields",
          xtype: "gridfield",
          fieldLabel: t("label-fields"),
          columns: [
            {
              text: t("app-title-metrictype"),
              dataIndex: "metric_type",
              width: 150,
              editor: {
                xtype: "pm.metrictype.LookupField",
              },
              renderer: NOC.render.Lookup("metric_type"),
            },
            {
              dataIndex: "external_alias",
              text: t("header-external-alias"),
              width: 150,
              editor: "textfield",
            },
            {
              text: t("header-expose-mx"),
              dataIndex: "expose_mx",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("header-expose-condition"),
              dataIndex: "expose_condition",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
          ],

        },
      ],
    });
    me.callParent();
  },
  filters: [
    {
      title: t("app-title-by-active"),
      name: "is_active",
      ftype: "boolean",
    },
  ],
});
