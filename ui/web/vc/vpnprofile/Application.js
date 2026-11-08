//---------------------------------------------------------------------
// vc.vpnprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.vc.vpnprofile.Application");

Ext.define("NOC.vc.vpnprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.vc.vpnprofile.Model",
    "NOC.main.style.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.wf.workflow.LookupField",
    "NOC.ip.prefixprofile.LookupField",
  ],
  model: "NOC.vc.vpnprofile.Model",
  rowClassField: "row_class",
  search: true,
  helpId: "reference-vpn-profile",
  viewModel: {
    data: {
      vpnType: null,
    },
    formulas: {
      requireDefaultPrefix: {
        bind: {
          bindTo: "{vpnType.selection}",
        },
        get: function(t){
          return t && t.data.field1 === "vrf"
        },
      },
    },
  },

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
          text: t("header-type"),
          dataIndex: "type",
          width: 100,
        },
        {
          text: t("app-group-wf"),
          dataIndex: "workflow",
          width: 150,
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
          name: "type",
          xtype: "combobox",
          fieldLabel: t("header-type"),
          store: [
            ["vrf", "VRF"],
            ["vxlan", "VxLAN"],
            ["vpls", "VPLS"],
            ["vll", "VLL"],
            ["evpn", "EVPN"],
            ["ipsec", "IPSec"],
            ["gre", "GRE"],
            ["ipip", "IP-IP"],
          ],
          allowBlank: false,
          uiStyle: "medium",
          reference: "vpnType",
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
          fieldLabel: t("header-template"),
          allowBlank: true,
        },
        {
          name: "default_prefix_profile",
          xtype: "ip.prefixprofile.LookupField",
          fieldLabel: t("label-default-prefix-profile"),
          bind: {
            disabled: "{!requireDefaultPrefix}",
          },
          allowBlank: false,
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
            "enable_vpnprofile": true,
          },
        },
      ],
    });
    me.callParent();
  },
});
