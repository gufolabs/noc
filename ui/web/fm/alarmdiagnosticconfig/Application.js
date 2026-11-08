//---------------------------------------------------------------------
// fm.alarmdiagnosticconfig application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.fm.alarmdiagnosticconfig.Application");

Ext.define("NOC.fm.alarmdiagnosticconfig.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.fm.alarmdiagnosticconfig.Model",
    "NOC.fm.alarmclass.LookupField",
    "NOC.main.ref.script.LookupField",
    "NOC.sa.action.LookupField",
    "NOC.core.combotree.ComboTree",
  ],
  model: "NOC.fm.alarmdiagnosticconfig.Model",
  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 100,
        },
        {
          text: t("header-is-active"),
          dataIndex: "is_active",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("app-title-alarmclass"),
          dataIndex: "alarm_class",
          flex: 1,
          renderer: NOC.render.Lookup("alarm_class"),
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
        },
        {
          xtype: "tabpanel",
          layout: "fit",
          autoScroll: true,
          anchor: "-0, -50",
          defaults: {
            autoScroll: true,
            layout: "anchor",
            padding: 10,
          },
          items: [
            {
              title: t("app-title-common"),
              items: [
                {
                  name: "is_active",
                  xtype: "checkbox",
                  boxLabel: t("header-active"),
                },
                {
                  name: "alarm_class",
                  xtype: "fm.alarmclass.LookupField",
                  fieldLabel: t("app-title-alarmclass"),
                  uiStyle: "large",
                  allowBlank: false,
                },
                {
                  name: "only_root",
                  xtype: "checkbox",
                  boxLabel: t("label-only-root"),
                },
                {
                  name: "resource_group",
                  xtype: "noc.core.combotree",
                  restUrl: "/inv/resourcegroup/",
                  fieldLabel: t("label-resource-group"),
                  listWidth: 1,
                  listAlign: "left",
                  labelAlign: "left",
                  width: 500,
                },
                {
                  name: "description",
                  xtype: "textarea",
                  fieldLabel: t("label-description"),
                  allowBlank: true,
                  anchor: "100%",
                },
              ],
            },
            {
              title: t("app-title-on-raise"),
              items: [
                {
                  name: "enable_on_raise",
                  xtype: "checkbox",
                  boxLabel: t("label-enable"),
                },
                {
                  name: "on_raise_delay",
                  xtype: "numberfield",
                  fieldLabel: t("label-delay"),
                  min: 0,
                  allowBlank: true,
                },
                {
                  name: "on_raise_header",
                  xtype: "textarea",
                  fieldLabel: t("label-header"),
                  allowBlank: true,
                },
                {
                  name: "on_raise_script",
                  xtype: "main.ref.script.LookupField",
                  fieldLabel: t("label-script"),
                  width: 150,
                  allowBlank: true,
                },
                {
                  name: "on_raise_action",
                  xtype: "sa.action.LookupField",
                  fieldLabel: t("app-title-action"),
                  width: 150,
                  allowBlank: true,
                },
                {
                  name: "on_raise_handler",
                  xtype: "textfield",
                  fieldLabel: t("app-title-handler"),
                  allowBlank: true,
                },
              ],
            },
            {
              title: t("msg-periodic"),
              items: [
                {
                  name: "enable_periodic",
                  xtype: "checkbox",
                  boxLabel: t("label-enable"),
                },
                {
                  name: "periodic_interval",
                  xtype: "numberfield",
                  fieldLabel: t("label-delay"),
                  min: 0,
                  allowBlank: true,
                },
                {
                  name: "periodic_header",
                  xtype: "textarea",
                  fieldLabel: t("label-header"),
                  allowBlank: true,
                },
                {
                  name: "periodic_script",
                  xtype: "main.ref.script.LookupField",
                  fieldLabel: t("label-script"),
                  width: 150,
                  allowBlank: true,
                },
                {
                  name: "periodic_action",
                  xtype: "sa.action.LookupField",
                  fieldLabel: t("app-title-action"),
                  width: 150,
                  allowBlank: true,
                },
                {
                  name: "periodic_handler",
                  xtype: "textfield",
                  fieldLabel: t("app-title-handler"),
                  allowBlank: true,
                },
              ],
            },
            {
              title: t("app-title-on-clear"),
              items: [
                {
                  name: "enable_on_clear",
                  xtype: "checkbox",
                  boxLabel: t("label-enable"),
                },
                {
                  name: "on_clear_delay",
                  xtype: "numberfield",
                  fieldLabel: t("label-delay"),
                  min: 0,
                  allowBlank: true,
                },
                {
                  name: "on_clear_header",
                  xtype: "textarea",
                  fieldLabel: t("label-header"),
                  allowBlank: true,
                },
                {
                  name: "on_clear_script",
                  xtype: "main.ref.script.LookupField",
                  fieldLabel: t("label-script"),
                  width: 150,
                  allowBlank: true,
                },
                {
                  name: "on_clear_action",
                  xtype: "sa.action.LookupField",
                  fieldLabel: t("app-title-action"),
                  width: 150,
                  allowBlank: true,
                },
                {
                  name: "on_clear_handler",
                  xtype: "textfield",
                  fieldLabel: t("app-title-handler"),
                  allowBlank: true,
                },
              ],
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
