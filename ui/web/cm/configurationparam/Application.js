//---------------------------------------------------------------------
// cm.configurationparam application
//---------------------------------------------------------------------
// Copyright (C) 2007-2023 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.cm.configurationparam.Application");

Ext.define("NOC.cm.configurationparam.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.cm.configurationparam.Model",
    "NOC.cm.configurationscope.LookupField",
    "NOC.pm.measurementunits.LookupField",
    "NOC.pm.metrictype.LookupField",
    "NOC.inv.modelinterface.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.cm.configurationparam.Model",
  search: true,

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/cm/configurationparam/{0}/json/",
      previewName: "Configuration Scope: {0}",
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
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "code",
          xtype: "textfield",
          fieldLabel: t("label-code"),
          allowBlank: false,
          uiStyle: "large",
        },
        {
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          store: [
            ["string", t("msg-string")],
            ["number", t("header-number")],
            ["bool", t("msg-bool")],
          ],
          allowBlank: false,
          labelWidth: 200,
          value: "string",
          uiStyle: "large",
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
          labelAlign: "top",
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-metric-threshold-bind"),
          layout: "hbox",
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "threshold_type",
              xtype: "combobox",
              fieldLabel: t("label-threshold-type"),
              store: [
                ["critical_min", t("msg-min-critical")],
                ["warning_min", t("msg-min-warning")],
                ["warning_max", t("msg-max-warning")],
                ["critical_max", t("msg-max-critical")],
              ],
              allowBlank: true,
              labelWidth: 200,
            },
            {
              name: "metric_type",
              xtype: "pm.metrictype.LookupField",
              fieldLabel: t("app-title-metrictype"),
              allowBlank: true,
            },
          ],
        },
        {
          name: "scopes",
          xtype: "gridfield",
          fieldLabel: t("label-configuration-scopes"),
          labelAlign: "top",
          columns: [
            {
              dataIndex: "scope",
              text: t("header-name"),
              editor: "cm.configurationscope.LookupField",
              renderer: NOC.render.Lookup("scope"),
              width: 150,
            },
            {
              text: t("header-required"),
              dataIndex: "is_required",
              width: 50,
              editor: "checkbox",
              renderer: NOC.render.Bool,
            },
          ],
        },
        {
          name: "schema",
          xtype: "gridfield",
          fieldLabel: t("label-parameters-schema"),
          labelAlign: "top",
          columns: [
            {
              dataIndex: "key",
              text: t("header-key"),
              width: 150,
              editor: {
                xtype: "combobox",
                store: [
                  ["max", "Maximum"],
                  ["min", "Minimum"],
                  ["recommended_max", "Recommend Max"],
                  ["recommended_min", "Recommend Minimum"],
                  ["max_length", "Max Length"],
                  ["min_length", "Min Length"],
                  ["pattern", "Pattern"],
                  ["step", "Step"],
                  ["decimal", "Decimal"],
                ],
              },
            },
            {
              dataIndex: "format",
              text: t("header-format"),
              width: 70,
              editor: {
                xtype: "combobox",
                store: [
                  ["date-time", "DateTime"],
                  ["email", "email"],
                  ["uuid", "UUID"],
                  ["ip", "IP"],
                ],
              },
            },
            {
              dataIndex: "value",
              text: t("header-value"),
              editor: "textfield",
              width: 200,
            },
            {
              text: t("app-title-modelinterface"),
              dataIndex: "model_interface",
              editor: {
                xtype: "inv.modelinterface.LookupField",
                forceSelection: true,
                valueField: "label",
              },
            },
            {
              text: t("header-attribute"),
              dataIndex: "model_attr",
              editor: "textfield",
            },
          ],
        },
        {
          name: "choices",
          xtype: "gridfield",
          fieldLabel: t("label-parameter-choices"),
          labelAlign: "top",
          columns: [
            {
              dataIndex: "name",
              text: t("header-name-2"),
              editor: "textfield",
              width: 200,
            },
            {
              dataIndex: "value",
              text: t("header-value"),
              editor: "textfield",
              width: 200,
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
