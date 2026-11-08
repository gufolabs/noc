//---------------------------------------------------------------------
// inv.cpeprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.cpeprofile.Application");

Ext.define("NOC.inv.cpeprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.ListFormField",
    "NOC.core.tagfield.Tagfield",
    "NOC.main.handler.LookupField",
    "NOC.inv.cpeprofile.Model",
    "NOC.main.pool.LookupField",
    "NOC.main.glyph.LookupField",
    "NOC.sa.managedobject.LookupField",
    "NOC.sa.managedobjectprofile.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.main.style.LookupField",
    "NOC.pm.metrictype.LookupField",
  ],
  model: "NOC.inv.cpeprofile.Model",
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
            "allow_models": ["inv.CPEProfile"],
          },
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("label-workflow"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-display-settings"),
          items: [
            {
              name: "style",
              xtype: "main.style.LookupField",
              fieldLabel: t("app-title-style"),
              allowBlank: true,
            },
            {
              name: "glyph",
              xtype: "main.glyph.LookupField",
              fieldLabel: t("app-title-glyph"),
              allowBlank: true,
            },
            {
              name: "shape_title_template",
              xtype: "textarea",
              maxLength: 250,
              fieldLabel: t("label-shape-name-template"),
              allowBlank: true,
              width: 650,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-managedobject-sync-settings"),
          items: [
            {
              name: "sync_managedobject",
              xtype: "checkbox",
              boxLabel: t("label-sync-managedobject"),
            },
            {
              name: "object_profile",
              xtype: "sa.managedobjectprofile.LookupField",
              fieldLabel: t("app-title-managedobjectprofile"),
              allowBlank: true,
            },
            {
              name: "pool",
              xtype: "main.pool.LookupField",
              fieldLabel: t("label-pool"),
              allowBlank: true,
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-asset-sync-settings"),
          items: [
            {
              name: "sync_asset",
              xtype: "checkbox",
              boxLabel: t("label-sync-asset"),
            },
          ],
        },
        {
          name: "cpe_status_discovery",
          xtype: "combobox",
          fieldLabel: t("label-status-discovery"),
          allowBlank: true,
          labelWidth: 200,
          defaultValue: "D",
          store: [
            ["D", t("msg-disabled")],
            ["E", t("label-enable")],
          ],
          uiStyle: "medium",
        },
        {
          xtype: "container",
          layout: "hbox",
          defaults: {
            padding: "0 8 0 0",
          },
          items: [
            {
              name: "metrics_default_interval",
              xtype: "numberfield",
              fieldLabel: t("label-default-interval-sec"),
              labelWidth: 200,
              allowBlank: false,
              uiStyle: "small",
              minValue: 0,
              listeners: {
                scope: me,
                change: function(_item, newValue){
                  me.form.findField("metrics_default_interval_calculated").setValue(newValue);
                },
              },
            },
            {
              name: "metrics_default_interval_calculated",
              xtype: "displayfield",
              renderer: NOC.render.Duration,
            },
          ],
        },
        {
          name: "metrics_interval_buckets",
          xtype: "numberfield",
          fieldLabel: t("label-metrics-interval-buckets"),
          allowBlank: true,
          uiStyle: "medium",
          minValue: 0,
        },
        {
          name: "metrics",
          xtype: "gridfield",
          fieldLabel: t("label-metrics"),
          minWidth: me.formMinWidth,
          maxWidth: me.formMaxWidth,
          columns: [
            {
              text: t("app-title-metrictype"),
              dataIndex: "metric_type",
              width: 250,
              editor: {
                xtype: "pm.metrictype.LookupField",
              },
              renderer: NOC.render.Lookup("metric_type"),
            },
            {
              text: t("header-stored"),
              dataIndex: "is_stored",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("label-interval"),
              dataIndex: "interval",
              editor: {
                xtype: "numberfield",
                minValue: 0,
              },
            },
          ],
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
              minValue: 0,
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
              name: "type",
              xtype: "combobox",
              fieldLabel: t("label-cpe-type"),
              allowBlank: true,
              labelWidth: 200,
              store: [
                ["ap", "Access Point"],
                ["dsl", "DSL"],
                ["ont", "ONT (PON)"],
                ["docsis", "DOCSIS"],
                ["other", "Other"],
              ],
              uiStyle: "medium",
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
