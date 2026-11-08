//---------------------------------------------------------------------
// main.report application
//---------------------------------------------------------------------
// Copyright (C) 2007-2023 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.reportconfig.Application");

Ext.define("NOC.main.reportconfig.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.ListFormField",
    "NOC.core.label.LabelField",
    "NOC.core.StringListField",
    "Ext.ux.form.JSONField",
    "Ext.ux.form.StringsField",
    "Ext.ux.form.GridField",
    "NOC.main.ref.modelid.LookupField",
    "NOC.main.ref.ulanguage.LookupField",
    "NOC.main.ref.datasource.LookupField",
    "NOC.main.ref.reportsource.LookupField",
    "NOC.main.ref.reportformatter.LookupField",
    "NOC.aaa.group.LookupField",
    "NOC.aaa.user.LookupField",
  ],
  model: "NOC.main.reportconfig.Model",
  search: true,
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/main/reportconfig/{0}/json/",
      previewName: "Report: {0}",
    });
    me.ITEM_JSON = me.registerItem(me.jsonPanel);

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 250,
        },
        {
          text: t("header-builtin"),
          dataIndex: "is_builtin",
          renderer: NOC.render.Bool,
          width: 30,
        },
        {
          text: t("label-code"),
          dataIndex: "code",
          width: 100,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
      ],
      fields: [
        {
          xtype: "container",
          items: [
            {
              name: "uuid",
              xtype: "displayfield",
              fieldLabel: t("label-uuid"),
            },
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              allowBlank: true,
              uiStyle: "large",
            },
          ],
        },
        {
          xtype: "tabpanel",
          layout: "fit",
          autoScroll: true,
          anchor: "-0, -50",
          defaults: {
            autoScroll: true,
            layout: "anchor",
          },
          items: [ // tabs
            {
              title: t("app-title-common"),
              items: [
                {
                  name: "title",
                  xtype: "textfield",
                  fieldLabel: t("label-title"),
                  uiStyle: "large",
                },
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  uiStyle: "large",
                },
                {
                  name: "code",
                  xtype: "textfield",
                  fieldLabel: t("label-code"),
                  allowBlank: true,
                  uiStyle: "large",
                },
                {
                  name: "category",
                  xtype: "combobox",
                  fieldLabel: t("header-category"),
                  allowBlank: true,
                  store: [
                    ["main", t("msg-main")],
                    ["fm", t("app-group-fm")],
                    ["sa", t("app-group-sa")],
                    ["inv", t("app-title-inv")],
                    ["sla", t("app-group-sla")],
                  ],
                },
                {
                  name: "report_source",
                  xtype: "main.ref.reportsource.LookupField",
                  fieldLabel: t("label-report-source"),
                  allowBlank: true,
                },
                {
                  name: "hide",
                  xtype: "checkboxfield",
                  boxLabel: t("label-hide-report-from-ui"),
                  allowBlank: false,
                },
                {
                  name: "time_params",
                  xtype: "combobox",
                  fieldLabel: t("label-time-params"),
                  allowBlank: true,
                  store: [
                    ["N", t("msg-nothing")],
                    ["D", t("msg-date-interval")],
                    ["T", t("msg-time-interval")],
                    ["A", t("msg-date-interval-with-align")],
                  ],
                },
              ],
            }, // Text
            {
              title: t("label-bands"),
              items: [
                {
                  xtype: "fieldset",
                  title: t("app-title-root-band"),
                  items: [
                    {
                      name: "root_orientation",
                      xtype: "combobox",
                      fieldLabel: t("label-orientation"),
                      allowBlank: true,
                      defaultValue: "H",
                      store: [
                        ["H", t("msg-horizontal")],
                        ["V", t("msg-vertical")],
                        ["C", t("app-title-cross")],
                        ["U", t("msg-undefined")],
                      ],
                    },
                    {
                      name: "root_queries",
                      xtype: "gridfield",
                      fieldLabel: t("label-column-formats"),
                      columns: [
                        {
                          dataIndex: "datasource",
                          text: t("btn-datasource"),
                          renderer: NOC.render.Lookup("datasource"),
                          editor: "main.ref.datasource.LookupField",
                          width: 200,
                        },
                        {
                          dataIndex: "ds_query",
                          text: t("label-query"),
                          editor: "textfield",
                          width: 300,
                        },
                        {
                          text: t("btn-json-data"),
                          dataIndex: "json",
                          editor: "jsonfield",
                          flex: 1,
                          renderer: NOC.render.JSON,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "bands",
                  xtype: "listform",
                  rows: 10,
                  fieldLabel: t("label-bands"),
                  labelAlign: "top",
                  items: [

                    {
                      name: "name",
                      xtype: "textfield",
                      fieldLabel: t("label-code"),
                      allowBlank: false,
                    },
                    {
                      name: "parent",
                      xtype: "textfield",
                      fieldLabel: t("header-parent"),
                      allowBlank: true,
                    },
                    {
                      name: "orientation",
                      xtype: "combobox",
                      fieldLabel: t("label-orientation"),
                      allowBlank: true,
                      defaultValue: "H",
                      store: [
                        ["H", t("msg-horizontal")],
                        ["V", t("msg-vertical")],
                        ["C", t("app-title-cross")],
                        ["U", t("msg-undefined")],
                      ],
                    },
                    {
                      name: "condition_param",
                      xtype: "textfield",
                      fieldLabel: t("label-condition-param"),
                      allowBlank: true,
                    },
                    {
                      name: "condition_value",
                      xtype: "textfield",
                      fieldLabel: t("label-condition-value"),
                      allowBlank: true,
                    },
                    {
                      name: "queries",
                      xtype: "gridfield",
                      fieldLabel: t("label-column-formats"),
                      columns: [
                        {
                          dataIndex: "datasource",
                          text: t("btn-datasource"),
                          editor: "main.ref.datasource.LookupField",
                          renderer: NOC.render.Lookup("datasource"),
                          width: 200,
                        },
                        {
                          dataIndex: "ds_query",
                          text: t("label-query"),
                          editor: "textfield",
                          width: 300,
                        },
                        {
                          text: t("btn-json-data"),
                          dataIndex: "json",
                          editor: "jsonfield",
                          flex: 1,
                          renderer: NOC.render.JSON,
                        },
                      ],
                    },
                  ],
                },
              ],
            }, // Text
            {
              title: t("app-title-kbentrytemplate"),
              items: [
                {
                  name: "templates",
                  xtype: "listform",
                  rows: 4,
                  labelAlign: "top",
                  items: [
                    {
                      name: "code",
                      xtype: "textfield",
                      fieldLabel: t("label-code"),
                      allowBlank: false,
                    },
                    {
                      name: "handler",
                      xtype: "main.ref.reportformatter.LookupField",
                      fieldLabel: t("label-report-formatter"),
                      allowBlank: false,
                    },
                    {
                      name: "output_type",
                      xtype: "combobox",
                      fieldLabel: t("label-output-type"),
                      allowBlank: true,
                      store: [
                        ["csv", t("btn-csv")],
                        // ["pdf", t("PDF")],
                        // ["table", t("Table")],
                        ["ssv", t("msg-ssv")],
                        ["html", t("msg-html")],
                        ["xlsx", t("msg-xlsx")],
                      ],
                    },
                    {
                      name: "output_name_pattern",
                      xtype: "textfield",
                      fieldLabel: t("label-filename-pattern"),
                    },
                    {
                      name: "is_alterable_output",
                      xtype: "checkbox",
                      allowBlank: true,
                      fieldLabel: t("label-alterable-output"),
                    },
                    {
                      name: "has_preview",
                      xtype: "checkbox",
                      allowBlank: true,
                      fieldLabel: t("label-has-preview"),
                    },
                  ],
                },
              ],
            }, // Components
            {
              title: t("label-permissions"),
              items: [
                {
                  name: "permissions",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-user"),
                      dataIndex: "user",
                      width: 250,
                      renderer: NOC.render.Lookup("user"),
                      editor: "aaa.user.LookupField",
                    },
                    {
                      text: t("header-group"),
                      dataIndex: "group",
                      width: 250,
                      renderer: NOC.render.Lookup("group"),
                      editor: "aaa.group.LookupField",
                    },
                    {
                      text: t("app-title-edit"),
                      dataIndex: "edit",
                      width: 50,
                      renderer: NOC.render.Bool,
                      editor: "checkbox",
                      defaultValue: false,
                    },
                    {
                      text: t("btn-launch"),
                      dataIndex: "launch",
                      width: 50,
                      renderer: NOC.render.Bool,
                      editor: "checkbox",
                      defaultValue: true,
                    },
                  ],
                },
              ],
            }, // Permissions
            {
              title: t("label-parameters"),
              items: [
                {
                  name: "parameters",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      width: 200,
                      editor: "textfield",
                    },
                    {
                      text: t("header-label"),
                      dataIndex: "label",
                      width: 200,
                      editor: "textfield",
                    },
                    {
                      text: t("header-type"),
                      dataIndex: "type",
                      width: 150,
                      editor: {
                        xtype: "combobox",
                        store: [
                          ["integer", t("msg-integer")],
                          ["string", t("msg-string")],
                          ["date", t("header-date")],
                          ["bool", t("msg-bool")],
                          ["choice", t("msg-choice-radio")],
                          ["combo-choice", t("msg-choice-combo")],
                          ["fields_selector", t("msg-fields-selector")],
                          ["model", t("msg-model-lookup")],
                          ["model_multi", t("msg-model-multi-choice")],
                        ],
                      },
                      renderer: NOC.render.Choices({
                        "integer": t("msg-integer"),
                        "string": t("msg-string"),
                        "date": t("header-date"),
                        "bool": t("msg-bool"),
                        "choice": t("msg-choice"),
                        "combo-choice": t("msg-choice-combo"),
                        "fields_selector": t("msg-fields-selector"),
                        "model": t("msg-model-lookup"),
                        "model_multi": t("msg-model-multi-choice"),
                      }),
                    },
                    {
                      text: t("btn-is-required"),
                      dataIndex: "required",
                      width: 50,
                      renderer: NOC.render.Bool,
                      editor: "checkbox",
                    },
                    {
                      text: t("header-is-hide"),
                      dataIndex: "hide",
                      width: 50,
                      renderer: NOC.render.Bool,
                      editor: "checkbox",
                    },
                    {
                      text: t("header-modelid"),
                      dataIndex: "model_id",
                      renderer: NOC.render.Lookup("model_id"),
                      editor: "main.ref.modelid.LookupField",
                      width: 150,
                    },
                    {
                      text: t("header-choices"),
                      dataIndex: "choices",
                      width: 200,
                      editor: "stringlistfield",
                    },
                    {
                      text: t("header-default"),
                      dataIndex: "default",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("btn-condition-param"),
                      dataIndex: "condition_param",
                      width: 200,
                      editor: "textfield",
                    },
                    {
                      text: t("btn-condition-values"),
                      dataIndex: "condition_values",
                      width: 200,
                      editor: "textfield",
                    },
                    {
                      text: t("label-description"),
                      dataIndex: "description",
                      flex: 1,
                      editor: "textfield",
                    },
                  ],
                },
              ],
            }, // Band Format
            {
              title: t("app-title-band-format"),
              items: [
                {
                  name: "bands_format",
                  xtype: "listform",
                  rows: 10,
                  labelAlign: "top",
                  items: [
                    {
                      name: "name",
                      xtype: "textfield",
                      fieldLabel: t("label-band-name"),
                      allowBlank: false,
                    },
                    {
                      name: "title_template",
                      xtype: "textfield",
                      fieldLabel: t("header-title-template"),
                      allowBlank: true,
                    },
                    {
                      name: "column_format",
                      xtype: "gridfield",
                      fieldLabel: t("label-format-columns"),
                      columns: [
                        {
                          dataIndex: "name",
                          text: t("header-name"),
                          editor: "textfield",
                          width: 150,
                        },
                        {
                          dataIndex: "title",
                          text: t("label-title"),
                          editor: "textfield",
                          width: 200,
                        },
                        {
                          text: t("btn-align"),
                          dataIndex: "align",
                          width: 100,
                          editor: {
                            xtype: "combobox",
                            store: [
                              ["1", t("msg-left")],
                              ["2", t("msg-right")],
                              ["3", t("msg-center")],
                              ["4", t("header-mask")],
                            ],
                          },
                          renderer: NOC.render.Choices({
                            "1": t("msg-left"),
                            "2": t("msg-right"),
                            "3": t("msg-center"),
                            "4": t("header-mask"),
                          }),
                        },
                        {
                          text: t("header-type"),
                          dataIndex: "format_type",
                          width: 100,
                          editor: {
                            xtype: "combobox",
                            store: [
                              ["integer", t("msg-integer")],
                              ["string", t("msg-string")],
                              ["float", t("msg-float")],
                            ],
                          },
                          renderer: NOC.render.Choices({
                            "integer": t("msg-integer"),
                            "string": t("msg-string"),
                            "float": t("msg-float"),
                          }),
                        },
                        {
                          text: t("header-total"),
                          dataIndex: "total",
                          width: 100,
                          editor: {
                            xtype: "combobox",
                            store: [
                              ["sum", t("msg-sum")],
                              ["count", t("header-count")],
                            ],
                          },
                          renderer: NOC.render.Choices({
                            "sum": t("msg-sum"),
                            "count": t("header-count"),
                          }),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: t("app-title-localization"),
              items: [
                {
                  name: "localization",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("btn-field"),
                      dataIndex: "field",
                      width: 300,
                      editor: "textfield",
                    },
                    {
                      text: t("header-language"),
                      dataIndex: "language",
                      renderer: NOC.render.Lookup("language"),
                      editor: "main.ref.ulanguage.LookupField",
                      width: 100,
                    },
                    {
                      text: t("header-value"),
                      dataIndex: "value",
                      width: 400,
                      editor: "textfield",
                    },
                  ],
                },
              ],
            }, // Localization
          ],
        },
      ],
      formToolbar: [
        {
          text: t("btn-json"),
          glyph: NOC.glyph.file,
          tooltip: t("help-view-as-json"),
          hasAccess: NOC.hasPermission("read"),
          scope: me,
          handler: me.onJSON,
        },
      ],
    });
    me.callParent();
  },
  //
  filters: [
    {
      title: t("app-title-by-builtin"),
      name: "is_builtin",
      ftype: "boolean",
    },
  ],
  //
  onJSON: function(){
    var me = this;
    me.showItem(me.ITEM_JSON);
    me.jsonPanel.preview(me.currentRecord, me.ITEM_FORM);
  },
});
