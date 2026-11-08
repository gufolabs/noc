//---------------------------------------------------------------------
// ip.addressprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.addressprofile.Application");

Ext.define("NOC.ip.addressprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.ip.addressprofile.Model",
    "NOC.wf.workflow.LookupField",
    "NOC.main.style.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.main.template.LookupField",
  ],
  model: "NOC.ip.addressprofile.Model",
  search: true,
  rowClassField: "row_class",

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
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 100,
          renderer: NOC.render.Lookup("workflow"),
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
        },
        {
          name: "workflow",
          xtype: "wf.workflow.LookupField",
          fieldLabel: t("app-group-wf"),
          allowBlank: false,
        },
        {
          name: "style",
          xtype: "main.style.LookupField",
          fieldLabel: t("app-title-style"),
          allowBlank: true,
        },
        {
          name: "name_template",
          xtype: "main.template.LookupField",
          fieldLabel: t("label-name-template"),
          allowBlank: true,
        },
        {
          name: "fqdn_template",
          xtype: "main.template.LookupField",
          fieldLabel: t("label-fqdn-template"),
          allowBlank: true,
        },
        {
          name: "seen_propagation_policy",
          xtype: "combobox",
          fieldLabel: t("label-seen-propagation"),
          allowBlank: false,
          store: [
            ["E", t("label-enable")],
            ["D", t("status-disable")],
          ],
          uiStyle: "medium",
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "right",
          },
          items: [
            {
              name: "remote_system",
              xtype: "main.remotesystem.LookupField",
              fieldLabel: t("app-title-remotesystem"),
              allowBlank: true,
            },
            {
              name: "remote_id",
              xtype: "textfield",
              fieldLabel: t("label-remote-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
            {
              name: "bi_id",
              xtype: "displayfield",
              fieldLabel: t("label-bi-id"),
              allowBlank: true,
              uiStyle: "medium",
            },
          ],
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "enable_addressprofile": true,
          },
        },
      ],
    });
    me.callParent();
  },
});
