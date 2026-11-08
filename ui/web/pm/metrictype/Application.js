//---------------------------------------------------------------------
// pm.metrictype application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.metrictype.Application");

Ext.define("NOC.pm.metrictype.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.pm.metrictype.Model",
    "NOC.core.tagfield.Tagfield",
    "NOC.pm.metricscope.LookupField",
    "NOC.pm.measurementunits.LookupField",
    "NOC.pm.scale.LookupField",
  ],
  model: "NOC.pm.metrictype.Model",
  search: true,
  treeFilter: "category",
  initComponent: function(){
    var me = this;

    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/pm/metrictype/{0}/json/",
      previewName: "Metric Type: {0}",
    });

    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 50,
          sortable: false,
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
          regex: /^[a-zA-Z0-9\-_ ]+( \| [a-zA-Z0-9\-_ ]+)*$/,
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
          allowBlank: true,
        },
        {
          name: "scope",
          xtype: "pm.metricscope.LookupField",
          fieldLabel: t("header-scope"),
          allowBlank: false,
        },
        {
          name: "field_name",
          xtype: "textfield",
          fieldLabel: t("label-field-name"),
          allowBlank: false,
          regex: /^[a-z][0-9a-z_]+$/,
          uiStyle: "medium",
        },
        {
          name: "field_type",
          xtype: "combobox",
          fieldLabel: t("label-field-type"),
          allowBlank: false,
          store: [
            ["UInt8", "UInt8"],
            ["Int8", "Int8"],
            ["UInt16", "UInt16"],
            ["Int16", "Int16"],
            ["UInt32", "UInt32"],
            ["Int32", "Int32"],
            ["UInt64", "UInt64"],
            ["Int64", "Int64"],
            ["Float32", "Float32"],
            ["Float64", "Float64"],
            ["String", "String"],
          ],
          uiStyle: "medium",
        },
        {
          xtype: "fieldset",
          title: t("nav-measurementunits"),
          tooltip: t("help-set-measurements-unit-for-metrictype-used-for-conversation-value"),
          layout: "vbox",
          defaults: {
            labelAlign: "before",
            padding: 4,
          },
          items: [
            {
              xtype: "container",
              layout: "hbox",
              defaults: {
                padding: "0 8 0 0",
              },
              items: [
                {
                  name: "units",
                  xtype: "pm.measurementunits.LookupField",
                  fieldLabel: t("label-metric-measurement-units"),
                  labelWidth: 150,
                  allowBlank: true,
                },
                {
                  name: "scale",
                  xtype: "pm.scale.LookupField",
                  fieldLabel: t("label-metric-scale"),
                },
                {
                  name: "is_delta",
                  xtype: "checkbox",
                  boxLabel: t("label-delta-value"),
                },
              ],
            },
          ],
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          xtype: "fieldset",
          title: t("label-compose-expression"),
          tooltip: t("help-compose-expression-for-metrictype-worked-only-same-scopeon-expre"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              xtype: "container",
              layout: "hbox",
              defaults: {
                labelAlign: "top",
                padding: "0 8 0 0",
              },
              items: [
                {
                  xtype: "core.tagfield",
                  url: "/pm/metrictype/lookup/",
                  fieldLabel: t("label-input-metric-type"),
                  tooltip: t("help-metric-type-inputs-to-expression"),
                  name: "compose_inputs",
                  labelWidth: 150,
                  width: 300,
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "compose_expression",
                  xtype: "textarea",
                  fieldLabel: t("label-compose-expression"),
                  allowBlank: true,
                  labelWidth: 150,
                  uiStyle: "medium",
                },
              ],
            },
          ],
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "collector_mappings",
          xtype: "gridfield",
          fieldLabel: t("label-collector-mappings"),
          allowBlank: true,
          columns: [
            {
              text: t("header-collector"),
              dataIndex: "collector",
              editor: "textfield",
              width: 100,
            },
            {
              text: t("btn-field"),
              dataIndex: "field",
              editor: "textfield",
              width: 100,
            },
            {
              text: t("header-allow-part"),
              dataIndex: "allow_partial_match",
              width: 50,
              renderer: NOC.render.Bool,
              editor: "checkbox",
            },
            {
              text: t("header-sender"),
              dataIndex: "sender",
              width: 150,
              editor: {
                xtype: "combobox",
                store: [
                  ["any", t("msg-any")],
                  ["noc_agent", t("msg-noc-agent")],
                  ["zabbix", t("msg-zabbix")],
                ],
              },
              renderer: NOC.render.Choices({
                "any": t("msg-any"),
                "noc_agent": t("msg-noc-agent"),
                "zabbix": t("msg-zabbix"),
              }),
            },
            {
              text: t("header-aliases"),
              dataIndex: "aliases",
              width: 300,
              editor: "stringlistfield",
            },
            {
              text: t("header-labels"),
              dataIndex: "in_labels",
              width: 300,
              editor: "stringlistfield",
            },
            {
              text: t("header-measurment-unit"),
              dataIndex: "unit",
              width: 200,
              editor: {
                xtype: "pm.measurementunits.LookupField",
              },
              renderer: NOC.render.Lookup("unit"),
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
