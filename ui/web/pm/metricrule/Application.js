//---------------------------------------------------------------------
// pm.metricrule application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.pm.metricrule.Application");

Ext.define("NOC.pm.metricrule.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.pm.metricrule.Model",
    "NOC.pm.metricaction.LookupField",
    "NOC.pm.metrictype.LookupField",
    "NOC.fm.alarmclass.LookupField",
    "NOC.core.label.LabelField",
    "NOC.core.tagfield.Tagfield",
    "NOC.core.ListFormField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.pm.metricrule.Model",
  search: true,

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
          align: "left",
        },
        {
          text: t("header-active"),
          dataIndex: "is_active",
          renderer: NOC.render.Bool,
          width: 100,
          align: "left",
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
          name: "is_active",
          xtype: "checkbox",
          boxLabel: t("header-active"),
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          uiStyle: "large",
        },
        {
          name: "actions",
          xtype: "listform",
          fieldLabel: t("nav-action"),
          rows: 8,
          // minHeight: 600,
          labelAlign: "top",
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
                  name: "is_active",
                  xtype: "checkbox",
                  isFormField: false,
                  boxLabel: t("header-active"),
                  width: 100,
                },
                {
                  name: "metric_action",
                  xtype: "pm.metricaction.LookupField",
                  isFormField: false,
                  fieldLabel: t("app-title-metricaction"),
                  listeners: {
                    scope: me,
                    select: me.onSelectQuery,
                  },
                  width: 400,
                  allowBlank: true,
                },
                {
                  xtype: "pm.metrictype.LookupField",
                  isFormField: false,
                  fieldLabel: t("app-title-metrictype"),
                  tooltip: t("help-metric-type-inputs"),
                  name: "metric_type",
                  labelWidth: 150,
                  width: 500,
                  listeners: {
                    render: me.addTooltip,
                  },
                },
              ],
            },
            {
              name: "thresholds",
              xtype: "gridfield",
              isFormField: false,
              fieldLabel: t("app-title-thresholds"),
              columns: [
                {
                  text: t("btn-op"),
                  dataIndex: "op",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["<", t("msg-text")],
                      ["<=", t("msg-text-2")],
                      [">", t("msg-text-3")],
                      [">=", t("msg-text-4")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "<": t("msg-text"),
                    "<=": t("msg-text-2"),
                    ">": t("msg-text-3"),
                    ">=": t("msg-text-4"),
                  }),
                },
                {
                  text: t("header-value"),
                  dataIndex: "value",
                  editor: {
                    xtype: "numberfield",
                    vtype: "float",
                    allowBlank: false,
                    emptyText: 2.0,
                    decimalPrecision: 2,
                  },
                },
                {
                  text: t("btn-clear-value"),
                  dataIndex: "clear_value",
                  editor: {
                    xtype: "numberfield",
                    vtype: "float",
                    allowBlank: true,
                  },
                },
                {
                  text: t("app-title-alarmclass"),
                  dataIndex: "alarm_class",
                  width: 200,
                  editor: {
                    xtype: "fm.alarmclass.LookupField",
                  },
                  renderer: NOC.render.Lookup("alarm_class"),
                },
                {
                  text: t("btn-alarm-labels"),
                  dataIndex: "alarm_labels",
                  renderer: NOC.render.LabelField,
                  editor: {
                    xtype: "labelfield",
                    query: {
                      "enable_alarm": true,
                    },
                  },
                  width: 200,
                },
              ],
            },
            {
              name: "metric_action_params",
              xtype: "gridfield",
              isFormField: false,
              fieldLabel: t("label-action-params"),
              columns: [
                {
                  dataIndex: "name",
                  text: t("header-name"),
                  width: 150,
                },
                {
                  dataIndex: "type",
                  text: t("header-type"),
                  width: 70,
                },
                {
                  dataIndex: "value",
                  text: t("header-value"),
                  editor: "textfield",
                  width: 200,
                },
                {
                  dataIndex: "min_value",
                  text: t("btn-min-value"),
                  width: 70,
                },
                {
                  dataIndex: "max_value",
                  text: t("btn-max-value"),
                  width: 70,
                },
                {
                  dataIndex: "default",
                  text: t("header-default"),
                  width: 100,
                },
                {
                  dataIndex: "description",
                  text: t("label-description"),
                  flex: 1,
                },
              ],
            },
          ],
        },
        {
          name: "match",
          xtype: "listform",
          fieldLabel: t("label-match-rules"),
          labelAlign: "top",
          rows: 5,
          items: [
            {
              xtype: "core.tagfield",
              url: "/inv/resourcegroup/lookup/",
              fieldLabel: t("label-object-groups"),
              name: "resource_groups",
              allowBlank: true,
              uiStyle: "extra",
            },
            {
              name: "labels",
              xtype: "labelfield",
              isFormField: false,
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
              name: "exclude_labels",
              xtype: "labelfield",
              isFormField: false,
              fieldLabel: t("label-exclude-match-labels"),
              allowBlank: true,
              isTree: true,
              filterProtected: false,
              pickerPosition: "down",
              uiStyle: "extra",
              query: {
                "allow_matched": true,
              },
            },
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  onSelectQuery: function(field, record){
    var me = this,
      form = field.up("[xtype=form]"),
      queryParamsField = form.down("gridfield[name=metric_action_params]");
    if(record && record.isModel){
      NOC.api.requestLegacy({
        url: "/pm/metricaction/" + record.get("id") + "/",
        scope: me,
        success: function(response){
          var data = Ext.decode(response.responseText);
          queryParamsField.setValue(data.params);
        },
      })
    } else{
      queryParamsField.store.removeAll();
    }
  },
});
