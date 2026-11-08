//---------------------------------------------------------------------
// inv.sensorprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.sensorprofile.Application");

Ext.define("NOC.inv.sensorprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.tagfield.Tagfield",
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.main.handler.LookupField",
    "NOC.inv.sensorprofile.Model",
    "NOC.pm.metrictype.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.style.LookupField",
    "NOC.pm.measurementunits.LookupField",
  ],
  model: "NOC.inv.sensorprofile.Model",
  search: true,
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          flex: 1,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
          width: 100,
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
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
          uiStyle: "extra",
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("label-workflow"),
          allowBlank: true,
        },
        {
          name: "style",
          xtype: "main.style.LookupField",
          fieldLabel: t("app-title-style"),
          allowBlank: true,
        },
        {
          name: "units",
          xtype: "pm.measurementunits.LookupField",
          fieldLabel: t("label-sensor-measurement-units"),
          allowBlank: true,
        },
        {
          name: "metric_type",
          xtype: "pm.metrictype.LookupField",
          fieldLabel: t("app-title-metrictype"),
          allowBlank: true,
        },
        {
          name: "mx_policy",
          xtype: "combobox",
          fieldLabel: t("label-mx-policy"),
          allowBlank: true,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "D", label: "Disable"},
              {id: "L", label: "As Sensor Label"},
              {id: "A", label: "As Alias"},
            ],
          },
          defaultValue: "D",
          uiStyle: "medium",
        },
        {
          name: "alias_template",
          xtype: "textfield",
          fieldLabel: t("label-sensor-alias-template"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "dynamic_classification_policy",
          xtype: "combobox",
          fieldLabel: t("label-dynamic-classification-policy"),
          allowBlank: false,
          queryMode: "local",
          displayField: "label",
          valueField: "id",
          store: {
            fields: ["id", "label"],
            data: [
              {id: "D", label: "Disable"},
              {id: "R", label: "By Rule"},
            ],
          },
          defaultValue: "R",
          uiStyle: "medium",
        },
        {
          name: "enable_collect",
          xtype: "checkbox",
          boxLabel: t("label-enable-collect"),
          allowBlank: true,
        },
        {
          name: "collect_interval",
          xtype: "numberfield",
          fieldLabel: t("label-collect-interval"),
          allowBlank: true,
          uiStyle: "medium",
          minValue: 1,
          maxValue: 3600,
        },
        {
          name: "bi_id",
          xtype: "displayfield",
          fieldLabel: t("label-bi-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "enable_sensorprofile": true,
          },
        },
        {
          name: "match_rules",
          xtype: "listform",
          fieldLabel: t("label-match-rules"),
          items: [
            {
              name: "dynamic_order",
              xtype: "numberfield",
              fieldLabel: t("label-dynamic-order"),
              allowBlank: true,
              defaultValue: 0,
              uiStyle: "small",
            },
            {
              name: "labels",
              xtype: "labelfield",
              fieldLabel: t("label-match-labels"),
              allowBlank: true,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
            {
              xtype: "core.tagfield",
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "resource_groups",
              allowBlank: true,
              uiStyle: "extra",
            },
            {
              name: "units",
              xtype: "pm.measurementunits.LookupField",
              fieldLabel: t("label-match-m-units"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "name_pattern",
              xtype: "textfield",
              fieldLabel: t("label-label-pattern"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
