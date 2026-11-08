//---------------------------------------------------------------------
// vc.l2domainprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2021 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.l2domainprofile.Application");

Ext.define("NOC.vc.l2domainprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.vc.l2domainprofile.Model",
    "NOC.wf.workflow.LookupField",
    "NOC.main.style.LookupField",
    "NOC.inv.resourcepool.LookupField",
    "NOC.vc.vlantemplate.LookupField",
    "NOC.vc.vlanfilter.LookupField",
    "NOC.main.remotesystem.LookupField",
  ],
  model: "NOC.vc.l2domainprofile.Model",
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
          name: "vlan_discovery_policy",
          xtype: "combobox",
          fieldLabel: t("label-vlan-discovery-policy"),
          allowBlank: false,
          uiStyle: "medium",
          value: "E",
          store: [
            ["D", "Disable"],
            ["E", "Enable"],
            ["S", "Status Only"],
          ],
        },
        {
          name: "vlan_discovery_filter",
          xtype: "vc.vlanfilter.LookupField",
          fieldLabel: t("label-vlan-discovery-filter"),
          allowBlank: true,
        },
        {
          name: "vlan_template",
          xtype: "vc.vlantemplate.LookupField",
          fieldLabel: t("app-title-vlantemplate"),
          allowBlank: true,
        },
        {
          name: "provisioning_policy",
          xtype: "combobox",
          fieldLabel: t("label-vlan-provisioning-policy"),
          allowBlank: false,
          uiStyle: "medium",
          value: "N",
          store: [
            ["D", "Disable"],
            ["E", "Enable"],
            ["A", "Add Only"],
          ],
        },
        {
          name: "pools",
          xtype: "gridfield",
          fieldLabel: t("label-vlan-pools"),
          columns: [
            {
              text: t("label-pool"),
              dataIndex: "pool",
              width: 200,
              editor: {
                xtype: "inv.resourcepool.LookupField",
              },
              renderer: NOC.render.Lookup("pool"),
            },
            {
              dataIndex: "description",
              text: t("label-description"),
              editor: "textfield",
              width: 150,
            },
            {
              text: t("app-title-vlanfilter"),
              dataIndex: "vlan_filter",
              width: 200,
              editor: {
                xtype: "vc.vlanfilter.LookupField",
              },
              renderer: NOC.render.Lookup("vlan_filter"),
            },
          ],
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
            "enable_l2domainprofile": true,
          },
        },
      ],
    });
    me.callParent();
  },
});
