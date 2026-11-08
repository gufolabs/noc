//---------------------------------------------------------------------
// vc.vpn application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.vpn.Application");

Ext.define("NOC.vc.vpn.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.StateField",
    "NOC.vc.vpn.Model",
    "NOC.vc.vpnprofile.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.project.project.LookupField",
    "NOC.sa.managedobject.LookupField",
    "NOC.vc.vpn.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.vc.vpn.Model",
  rowClassField: "row_class",
  search: true,
  helpId: "reference-vpn",

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
          text: t("header-profile"),
          dataIndex: "profile",
          width: 150,
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          width: 150,
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("label-project"),
          dataIndex: "project",
          width: 150,
          renderer: NOC.render.Lookup("project"),
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
          name: "profile",
          xtype: "vc.vpnprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: true,
        },
        {
          name: "parent",
          xtype: "vc.vpn.LookupField",
          fieldLabel: t("header-parent"),
          allowBlank: true,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
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
            "enable_vpn": true,
          },
        },
        {
          name: "route_target",
          xtype: "gridfield",
          fieldLabel: t("label-route-target"),
          allowBlank: true,
          columns: [
            {
              text: t("header-rd"),
              dataIndex: "rd",
              width: 75,
              editor: "textfield",
            },
            {
              text: t("header-object"),
              dataIndex: "managed_object",
              width: 150,
              renderer: NOC.render.Lookup("managed_object"),
              editor: "sa.managedobject.LookupField",
            },
            {
              text: t("btn-operation"),
              dataIndex: "op",
              width: 75,
              editor: {
                xtype: "combobox",
                store: [
                  ["both", "both"],
                  ["import", "import"],
                  ["export", "export"],
                ],
              },
            },
            {
              text: t("header-target"),
              dataIndex: "target",
              flex: 1,
              editor: "textfield",
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
