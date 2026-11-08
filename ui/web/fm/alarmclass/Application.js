//---------------------------------------------------------------------
// fm.alarmclass application
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmclass.Application");

Ext.define("NOC.fm.alarmclass.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.core.ListFormField",
    "NOC.fm.alarmclass.Model",
    "NOC.fm.alarmclass.LookupField",
    "NOC.core.label.LabelField",
    "Ext.ux.form.JSONField",
    "Ext.ux.form.StringsField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.fm.alarmclass.Model",
  search: true,
  treeFilter: "category",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;

    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/fm/alarmclass/{0}/json/",
      previewName: "Alarm Class: {0}",
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
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
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
          layout: "hbox",
          items: [
            {
              name: "name",
              xtype: "textfield",
              fieldLabel: t("header-name"),
              allowBlank: false,
              uiStyle: "large",
            },
            {
              name: "uuid",
              xtype: "displayfield",
              style: "padding-left: 10px",
              fieldLabel: t("label-uuid"),
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
              title: t("app-title-text"),
              items: [
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  uiStyle: "extra",
                },
                {
                  name: "subject_template",
                  xtype: "textfield",
                  fieldLabel: t("label-subject-template"),
                  uiStyle: "extra",
                  allowBlank: false,
                },
                {
                  name: "body_template",
                  xtype: "textarea",
                  fieldLabel: t("label-body-template"),
                  uiStyle: "extra",
                  allowBlank: false,
                },
                {
                  name: "symptoms",
                  xtype: "textarea",
                  fieldLabel: t("header-symptoms"),
                  uiStyle: "extra",
                  allowBlank: true,
                },
                {
                  name: "probable_causes",
                  xtype: "textarea",
                  fieldLabel: t("header-probable-causes"),
                  uiStyle: "extra",
                  allowBlank: true,
                },
                {
                  name: "recommended_actions",
                  xtype: "textarea",
                  fieldLabel: t("header-recommended-actions"),
                  uiStyle: "extra",
                  allowBlank: true,
                },
              ],
            }, // Text
            {
              title: t("header-severity"),
              items: [
                {
                  name: "labels",
                  xtype: "labelfield",
                  fieldLabel: t("header-labels"),
                  allowBlank: true,
                  uiStyle: "medium",
                  filterProtected: false,
                  query: {
                    "allow_models": ["fm.ActiveAlarm"],
                  },
                },
                {
                  name: "is_unique",
                  xtype: "checkboxfield",
                  boxLabel: t("header-unique"),
                },
                {
                  name: "user_clearable",
                  xtype: "checkboxfield",
                  boxLabel: t("label-user-clearable"),
                },
                {
                  name: "is_ephemeral",
                  xtype: "checkboxfield",
                  boxLabel: t("label-ephemeral"),
                },
                {
                  name: "by_reference",
                  xtype: "checkboxfield",
                  boxLabel: t("label-by-reference"),
                },
                {
                  name: "reference",
                  xtype: "stringsfield",
                  fieldLabel: t("label-reference"),
                },
              ],
            }, // Severity
            {
              title: t("app-title-variables"),
              items: [
                {
                  name: "vars",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("label-description"),
                      dataIndex: "description",
                      flex: 250,
                      editor: "textfield",
                    },
                    {
                      text: t("btn-default-labels"),
                      dataIndex: "default_labels",
                      renderer: NOC.render.LabelField,
                      editor: {
                        xtype: "labelfield",
                        filterProtected: false,
                        query: {
                          "allow_wildcard": true,
                          "allow_user": false,
                        } },
                      width: 200,
                    },
                    {
                      text: t("header-default"),
                      dataIndex: "default",
                      width: 150,
                      editor: "textfield",
                    },
                  ],
                },
              ],
            }, // Variables
            {
              title: t("app-title-data-sources"),
              items: [
                {
                  name: "datasources",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("btn-datasource"),
                      dataIndex: "datasource",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("app-title-search"),
                      dataIndex: "search",
                      flex: 1,
                      editor: "jsonfield",
                      renderer: NOC.render.JSON,
                    },
                  ],
                },
              ],
            }, // Data Sources
            {
              title: t("app-title-components"),
              items: [
                {
                  name: "components",
                  xtype: "listform",
                  fieldLabel: t("app-title-components"),
                  labelAlign: "top",
                  items: [
                    {
                      name: "name",
                      xtype: "textfield",
                      fieldLabel: t("header-name"),
                      allowBlank: false,
                    },
                    {
                      name: "model",
                      xtype: "textfield",
                      fieldLabel: t("header-model"),
                      allowBlank: false,
                    },
                    {
                      name: "args",
                      xtype: "gridfield",
                      fieldLabel: t("label-args"),
                      columns: [
                        {
                          dataIndex: "param",
                          text: t("btn-param"),
                          editor: "textfield",
                          width: 150,
                        },
                        {
                          dataIndex: "var",
                          text: t("btn-var"),
                          editor: "textfield",
                          width: 100,
                        },
                      ],
                    },
                  ],
                },
              ],
            }, // Components
            {
              title: t("header-root-cause"),
              items: [
                {
                  name: "root_cause",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      width: 200,
                      editor: "textfield",
                    },
                    {
                      text: t("msg-root"),
                      dataIndex: "root",
                      renderer: NOC.render.Lookup("root"),
                      editor: "fm.alarmclass.LookupField",
                      width: 200,
                    },
                    {
                      text: t("btn-window"),
                      dataIndex: "window",
                      width: 50,
                      editor: "numberfield",
                    },
                    {
                      text: t("label-condition"),
                      dataIndex: "condition",
                      editor: "textfield",
                      width: 150,
                    },
                    {
                      text: t("btn-match-condition"),
                      dataIndex: "match_condition",
                      editor: "jsonfield",
                      flex: 1,
                      renderer: NOC.render.JSON,
                    },
                  ],
                },
              ],
            }, // Root Cause
            {
              title: t("app-title-job"),
              items: [
                {
                  name: "jobs",
                  xtype: "gridfield",
                  columns: [
                    {
                      text: t("header-job"),
                      dataIndex: "job",
                      width: 100,
                      editor: "textfield",
                    },
                    {
                      text: t("label-interval"),
                      dataIndex: "interval",
                      width: 50,
                      editor: "numberfield",
                    },
                    {
                      text: t("header-vars"),
                      dataIndex: "vars",
                      flex: 1,
                      editor: "jsonfield",
                      renderer: NOC.render.JSON,
                    },
                  ],
                },
              ],
            }, // Jobs
            {
              title: t("nav-handler"),
              items: [
                {
                  xtype: "stringsfield",
                  name: "handlers",
                  fieldLabel: t("nav-handler"),
                },
                {
                  xtype: "stringsfield",
                  name: "clear_handlers",
                  fieldLabel: t("label-clear-handlers"),
                },
              ],
            }, // Handlers
            {
              title: t("app-title-plugins"),
              items: [
                {
                  xtype: "gridfield",
                  name: "plugins",
                  fieldLabel: t("app-title-plugins"),
                  columns: [
                    {
                      text: t("header-name"),
                      dataIndex: "name",
                      editor: "textfield",
                      width: 150,
                    },
                    {
                      text: t("btn-config"),
                      dataIndex: "config",
                      editor: "jsonfield",
                      flex: 1,
                      renderer: NOC.render.JSON,
                    },
                  ],
                },
              ],
            }, // Plugins
            {
              title: t("app-title-timing"),
              defaults: {
                labelWidth: 150,
              },
              items: [
                {
                  name: "flap_condition",
                  xtype: "combobox",
                  fieldLabel: t("label-flap-condition"),
                  tooltip: t("help-flap-detection"),
                  allowBlank: false,
                  uiStyle: "small",
                  store: [
                    ["none", t("msg-none")],
                    ["count", t("header-count")],
                  ],
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "flap_window",
                  xtype: "numberfield",
                  fieldLabel: t("label-flap-window-sec"),
                  tooltip: t("help-time-in-seconds-while-waiting-of-reopen"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "flap_threshold",
                  xtype: "numberfield",
                  fieldLabel: t("label-flap-threshold-pcs"),
                  tooltip: t("help-number-of-flaps-while-close-flap-window"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "notification_delay",
                  xtype: "numberfield",
                  fieldLabel: t("label-notification-delay-sec"),
                  tooltip: t("help-time-in-seconds-to-delay-alarm-risen-notification"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "control_time0",
                  xtype: "numberfield",
                  fieldLabel: t("label-control-time-0-sec"),
                  tooltip: t("help-control-time-to-reopen-alarm-instead-of-creating-new"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "control_time1",
                  xtype: "numberfield",
                  fieldLabel: t("label-control-time-1-sec"),
                  tooltip: t("help-control-time-to-reopen-alarm-after-1-reopen"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "control_timeN",
                  xtype: "numberfield",
                  fieldLabel: t("label-control-time-n-sec"),
                  tooltip: t("help-control-time-to-reopen-alarm-after-1-reopen-2"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
                {
                  name: "recover_time",
                  xtype: "numberfield",
                  fieldLabel: t("label-recover-time-sec"),
                  tooltip: t("help-consequence-recover-time-root-cause-will-be-detached-if-conseque"),
                  allowBlank: true,
                  uiStyle: "small",
                  listeners: {
                    render: me.addTooltip,
                  },
                },
              ],
            }, // Timing
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
