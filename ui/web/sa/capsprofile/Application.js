//---------------------------------------------------------------------
// sa.capsprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.capsprofile.Application");

Ext.define("NOC.sa.capsprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.sa.capsprofile.Model",
    "NOC.inv.capability.LookupField",
    "NOC.main.label.LookupField",
    "NOC.core.label.LabelField",
  ],
  model: "NOC.sa.capsprofile.Model",
  search: true,
  viewModel: {
    data: {
      "enableSNMP": false,
      "enableL2": false,
      "enableL3": false,
    },
  },

  initComponent: function(){
    var me = this,
      policyStore = [
        ["E", t("label-enable")],
        ["T", t("btn-enable-for-topology")],
        ["D", t("status-disable")],
      ];
    Ext.apply(me, {
      columns: [
        {
          text: "Name",
          dataIndex: "name",
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
          xtype: "fieldset",
          title: t("app-title-snmp"),
          items: [
            {
              name: "enable_snmp",
              xtype: "checkbox",
              boxLabel: t("label-enable-snmp"),
              reference: "enableSNMP",
            },
            {
              name: "enable_snmp_v1",
              xtype: "checkbox",
              boxLabel: t("label-snmp-v1"),
              bind: {
                disabled: "{!enableSNMP.checked}",
              },
            },
            {
              name: "enable_snmp_v2c",
              xtype: "checkbox",
              boxLabel: t("label-snmp-v2c"),
              bind: {
                disabled: "{!enableSNMP.checked}",
              },
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("app-title-l2"),
          items: [
            {
              name: "enable_l2",
              xtype: "checkbox",
              boxLabel: t("label-enable-l2"),
              reference: "enableL2",
            },
            {
              name: "bfd_policy",
              xtype: "combobox",
              fieldLabel: t("label-bfd"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "fdp_policy",
              xtype: "combobox",
              fieldLabel: t("label-fdp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "huawei_ndp_policy",
              xtype: "combobox",
              fieldLabel: t("label-huawei-ndp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "lacp_policy",
              xtype: "combobox",
              fieldLabel: t("label-lacp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "lldp_policy",
              xtype: "combobox",
              fieldLabel: t("label-lldp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "oam_policy",
              xtype: "combobox",
              fieldLabel: t("label-oam"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "rep_policy",
              xtype: "combobox",
              fieldLabel: t("label-rep"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "stp_policy",
              xtype: "combobox",
              fieldLabel: t("label-stp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
            {
              name: "udld_policy",
              xtype: "combobox",
              fieldLabel: t("label-udld"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL2.checked}",
              },
            },
          ],
        },
        {
          xtype: "fieldset",
          title: t("header-l3"),
          items: [
            {
              name: "enable_l3",
              xtype: "checkbox",
              boxLabel: t("label-enable-l3"),
              reference: "enableL3",
            },
            {
              name: "hsrp_policy",
              xtype: "combobox",
              fieldLabel: t("label-hsrp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "vrrp_policy",
              xtype: "combobox",
              fieldLabel: t("label-vrrp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "vrrpv3_policy",
              xtype: "combobox",
              fieldLabel: t("label-vrrp-v3"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "bgp_policy",
              xtype: "combobox",
              fieldLabel: t("label-bgp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "ospf_policy",
              xtype: "combobox",
              fieldLabel: t("label-ospf"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "ospfv3_policy",
              xtype: "combobox",
              fieldLabel: t("label-ospf-v3"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "isis_policy",
              xtype: "combobox",
              fieldLabel: t("label-isis"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "ldp_policy",
              xtype: "combobox",
              fieldLabel: t("label-ldp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
            {
              name: "rsvp_policy",
              xtype: "combobox",
              fieldLabel: t("label-rsvp"),
              store: policyStore,
              uiStyle: "medium",
              bind: {
                disabled: "{!enableL3.checked}",
              },
            },
          ],
        },
        {
          name: "error_caps_policy",
          xtype: "combobox",
          fieldLabel: t("label-errors-policy"),
          allowBlank: true,
          uiStyle: "medium",
          store: [
            ["I", "Ignore"],
            ["S", "Strict"],
            ["C", "Register Check"],
          ],
        },
        {
          name: "caps",
          xtype: "gridfield",
          fieldLabel: t("header-capabilities"),
          allowBlank: true,
          columns: [
            {
              text: t("header-name"),
              dataIndex: "capability",
              renderer: NOC.render.Lookup("capability"),
              width: 250,
              editor: "inv.capability.LookupField",
            },
            {
              text: t("header-required"),
              dataIndex: "required",
              width: 75,
              editor: "checkbox",
              renderer: NOC.render.Bool,
              sortable: false,
            },
            {
              text: t("header-default-value"),
              dataIndex: "default_value",
              width: 100,
              editor: "textfield",
              sortable: false,
            },
            {
              text: t("header-allow-manual"),
              dataIndex: "allow_manual",
              width: 75,
              editor: "checkbox",
              renderer: NOC.render.Bool,
              sortable: false,
            },
            {
              text: t("header-expose-caps"),
              dataIndex: "exposed",
              width: 75,
              editor: "checkbox",
              renderer: NOC.render.Bool,
              sortable: false,
            },
            {
              text: t("header-set-label"),
              dataIndex: "set_label",
              width: 200,
              editor: {
                xtype: "main.label.LookupField",
                // filterProtected: false,
                // query: {
                //   "set_wildcard": true,
                //
                // },
              },
              renderer: NOC.render.Lookup("set_label"),
              sortable: false,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
