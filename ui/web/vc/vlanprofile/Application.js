//---------------------------------------------------------------------
// vc.vlanprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.vlanprofile.Application");

Ext.define("NOC.vc.vlanprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.vc.vlanprofile.Model",
    "NOC.wf.workflow.LookupField",
    "NOC.main.style.LookupField",
    "NOC.main.ref.vlanrole.LookupField",
    "NOC.main.remotesystem.LookupField",
  ],
  model: "NOC.vc.vlanprofile.Model",
  search: true,
  helpId: "vlan-profile",
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;
    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
          width: 150,
        },
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 100,
          renderer: NOC.render.Lookup("workflow"),
        },
        {
          text: t("header-provisioning"),
          dataIndex: "enable_provisioning",
          width: 50,
          renderer: NOC.render.Bool,
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
          name: "enable_provisioning",
          xtype: "checkbox",
          boxLabel: t("label-enable-provisioning"),
        },
        {
          name: "role",
          xtype: "main.ref.vlanrole.LookupField",
          fieldLabel: t("header-role"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          layout: "hbox",
          title: t("app-title-integration"),
          defaults: {
            padding: 4,
            labelAlign: "top",
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
            "allow_models": "vc.VLANProfile",
          },
        },
      ],
    });
    me.callParent();
  },
});
