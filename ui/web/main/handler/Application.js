//---------------------------------------------------------------------
// main.handler application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.handler.Application");

Ext.define("NOC.main.handler.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.JSONPreview",
    "NOC.main.handler.Model",
  ],
  model: "NOC.main.handler.Model",
  search: true,
  helpId: "reference-handler",

  initComponent: function(){
    var me = this;
    // JSON Panel
    me.jsonPanel = Ext.create("NOC.core.JSONPreview", {
      app: me,
      restUrl: "/main/handler/{0}/json/",
      previewName: "Handler: {0}",
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
          text: t("app-title-handler"),
          dataIndex: "handler",
          flex: 1,
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          allowBlank: false,
          uiStyle: "meduim",
        },
        {
          name: "handler",
          xtype: "textfield",
          fieldLabel: t("app-title-handler"),
          allowBlank: false,
          vtype: "handler",
          uiStyle: "large",
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-config-handler"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_config_filter",
              xtype: "checkbox",
              boxLabel: t("label-allow-config-filter"),
            },
            {
              name: "allow_config_validation",
              xtype: "checkbox",
              boxLabel: t("label-allow-config-validation"),
            },
            {
              name: "allow_config_diff",
              xtype: "checkbox",
              boxLabel: t("label-allow-config-diff"),
            },
            {
              name: "allow_config_diff_filter",
              xtype: "checkbox",
              boxLabel: t("label-allow-config-diff-filter"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-managed-object-profile-handlers"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_housekeeping",
              xtype: "checkbox",
              boxLabel: t("label-allow-housekeeping"),
            },
            {
              name: "allow_resolver",
              xtype: "checkbox",
              boxLabel: t("label-allow-resolver"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-threshold-profiles-handlers"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_threshold",
              xtype: "checkbox",
              boxLabel: t("label-allow-threshold-alarm"),
            },
            {
              name: "allow_threshold_handler",
              xtype: "checkbox",
              boxLabel: t("label-allow-threshold-handler"),
            },
            {
              name: "allow_threshold_value_handler",
              xtype: "checkbox",
              boxLabel: t("label-allow-threshold-value-handler"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-topology-handlers"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_ifdesc",
              xtype: "checkbox",
              boxLabel: t("label-allow-ifdesc"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-datastream-handlers"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_ds_filter",
              xtype: "checkbox",
              boxLabel: t("label-allow-datastream-filter"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-mx-handlers"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_mx_transmutation",
              xtype: "checkbox",
              boxLabel: t("label-allow-mx-transmutation"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-math-rule"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_match_rule",
              xtype: "checkbox",
              boxLabel: t("label-allow-match-rule"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-diagnostic"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_diagnostics_checks",
              xtype: "checkbox",
              boxLabel: t("label-allow-diagnostics-check"),
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-fm-handlers"),
          layout: "vbox",
          defaults: {
            labelAlign: "top",
            padding: 4,
          },
          items: [
            {
              name: "allow_event",
              xtype: "checkbox",
              boxLabel: t("label-allow-event"),
            },
            {
              name: "allow_resource",
              xtype: "checkbox",
              boxLabel: t("label-allow-resource"),
            },
            {
              name: "allow_fm_alarm",
              xtype: "checkbox",
              boxLabel: t("label-allow-alarm"),
            },
          ],
        },
        {
          name: "allow_reaction",
          xtype: "checkbox",
          boxLabel: t("label-allow-reaction"),
        },
        {
          name: "allow_action",
          xtype: "checkbox",
          boxLabel: t("label-allow-action-command"),
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
