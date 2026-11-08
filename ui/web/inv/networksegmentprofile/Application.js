//---------------------------------------------------------------------
// inv.networksegmentprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2020 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.networksegmentprofile.Application");

Ext.define("NOC.inv.networksegmentprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.inv.networksegmentprofile.Model",
    "NOC.inv.networksegmentprofile.LookupField",
    "NOC.main.style.LookupField",
    "NOC.main.template.LookupField",
    "NOC.vc.vlanprofile.LookupField",
    "Ext.ux.form.GridField",
  ],
  model: "NOC.inv.networksegmentprofile.Model",
  search: true,
  helpId: "reference-network-segment-profile",
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
          text: t("header-vlan-discovery"),
          dataIndex: "enable_vlan",
          width: 50,
          renderer: NOC.render.Bool,
        },
        {
          text: t("app-title-style"),
          dataIndex: "style",
          renderer: NOC.render.Lookup("style"),
          flex: 1,
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
          name: "style",
          xtype: "main.style.LookupField",
          fieldLabel: t("app-title-style"),
          allowBlank: true,
        },
        {
          name: "discovery_interval",
          xtype: "numberfield",
          fieldLabel: t("label-discovery-interval"),
          allowBlank: false,
          uiStyle: "small",
        },
        {
          name: "autocreated_profile",
          xtype: "inv.networksegmentprofile.LookupField",
          fieldLabel: t("label-autocreated-profile"),
          allowBlank: true,
        },
        {
          name: "mac_restrict_to_management_vlan",
          xtype: "checkbox",
          boxLabel: t("label-restrict-mac-to-management-vlan"),
          allowBlank: true,
        },
        {
          name: "management_vlan",
          xtype: "numberfield",
          fieldLabel: t("msg-management-vlan"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: t("label-not-configured"),
          submitEmptyText: false,
          minValue: 1,
          maxValue: 4095,
        },
        {
          name: "multicast_vlan",
          xtype: "numberfield",
          fieldLabel: t("label-multicast-vlan"),
          allowBlank: true,
          uiStyle: "medium",
          emptyText: t("label-not-configured"),
          submitEmptyText: false,
          minValue: 1,
          maxValue: 4095,
        },
        {
          name: "enable_lost_redundancy",
          xtype: "checkbox",
          boxLabel: t("label-enable-lost-redundancy-check"),
        },
        {
          name: "horizontal_transit_policy",
          xtype: "combobox",
          fieldLabel: t("label-horizontal-transit-policy"),
          allowBlank: false,
          store: [
            ["E", t("msg-always-enable")],
            ["C", t("msg-calculate")],
            ["D", t("status-disable")],
          ],
          uiStyle: "medium",
        },
        {
          name: "topology_methods",
          xtype: "gridfield",
          fieldLabel: t("label-topology-methods"),
          columns: [
            {
              text: t("header-method"),
              dataIndex: "method",
              width: 100,
              editor: {
                xtype: "combobox",
                store: [
                  ["custom", "Custom ..."],
                  ["handler", "Handler ..."],
                  ["cdp", "CDP"],
                  ["huawei_ndp", "Huawei NDP"],
                  ["lacp", "LACP"],
                  ["lldp", "LLDP"],
                  ["oam", "OAM"],
                  ["rep", "REP"],
                  ["stp", "STP"],
                  ["udld", "UDLD"],
                  ["fdp", "FDP"],
                  ["bfd", "BFD"],
                  ["mac", "MAC"],
                  ["xmac", "xMAC"],
                  ["nri", "NRI"],
                  ["ifdesc", "Iface Description"],
                ],
              },
            },
            {
              text: t("header-active"),
              dataIndex: "is_active",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              flex: 1,
            },
          ],
        },
        {
          name: "uplink_policy",
          xtype: "gridfield",
          fieldLabel: t("label-uplink-policy"),
          columns: [
            {
              text: t("header-method"),
              dataIndex: "method",
              width: 150,
              editor: {
                xtype: "combobox",
                store: [
                  ["seghier", t("msg-segment-hierarchy")],
                  ["molevel", t("msg-managed-object-level")],
                  ["seg", t("msg-all-segment-objects")],
                  ["minaddr", t("msg-lesser-management-address")],
                  ["maxaddr", t("msg-greater-management-address")],
                ],
              },
            },
            {
              text: t("header-active"),
              dataIndex: "is_active",
              editor: "checkbox",
              renderer: NOC.render.Bool,
              flex: 1,
            },
          ],
        },
        {
          name: "enable_vlan",
          xtype: "checkbox",
          boxLabel: t("label-enable-vlan-discovery"),
        },
        {
          name: "default_vlan_profile",
          xtype: "vc.vlanprofile.LookupField",
          fieldLabel: t("label-default-vlan-profile"),
          allowBlank: true,
        },
        {
          xtype: "fieldset",
          title: t("app-title-biosegmentation"),
          items: [
            {
              name: "is_persistent",
              xtype: "checkbox",
              boxLabel: t("label-persistent"),
            },
            {
              name: "bio_collision_policy",
              xtype: "gridfield",
              fieldLabel: t("label-collision-policy"),
              columns: [
                {
                  text: t("btn-min-attacker-lvl"),
                  dataIndex: "min_attacker_level",
                  editor: {
                    xtype: "numberfield",
                  },
                },
                {
                  text: t("btn-max-attacker-lvl"),
                  dataIndex: "max_attacker_level",
                  editor: {
                    xtype: "numberfield",
                  },
                },
                {
                  text: t("header-match-type"),
                  dataIndex: "match_type",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["p", t("label-persistent")],
                      ["f", t("msg-floating")],
                      ["*", t("msg-any")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "p": t("label-persistent"),
                    "f": t("msg-floating"),
                    "*": t("msg-any"),
                  }),
                },
                {
                  text: t("btn-match-level"),
                  dataIndex: "match_level",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["-", t("btn-no-link")],
                      ["<", "<"],
                      ["<=", "<="],
                      ["==", "=="],
                      [">=", ">="],
                      [">", ">"],
                      ["*", t("msg-any")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "-": t("btn-no-link"),
                    "<": "<",
                    "<=": "<=",
                    "==": "==",
                    ">=": ">=",
                    ">": ">",
                    "*": t("msg-any"),
                  }),
                },
                {
                  text: t("btn-segment-power-function"),
                  dataIndex: "power_function",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["AVG", t("msg-average-level")],
                      ["SUM", t("msg-summary-level")],
                      ["MAX", t("msg-max-level")],
                      ["MIN", t("msg-min-level")],
                      ["DIFF", t("msg-diff-level")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "AVG": t("msg-average-level"),
                    "SUM": t("msg-summary-level"),
                    "MAX": t("msg-max-level"),
                    "MIN": t("msg-min-level"),
                    "DIFF": t("msg-diff-level"),
                  }),
                },
                {
                  text: t("header-policy"),
                  dataIndex: "policy",
                  width: 100,
                  editor: {
                    xtype: "combobox",
                    store: [
                      ["merge", t("msg-merge")],
                      ["keep", t("msg-keep")],
                      ["eat", t("msg-eat")],
                      ["feed", t("msg-feed")],
                      ["calcify", t("msg-calcify")],
                    ],
                  },
                  renderer: NOC.render.Choices({
                    "merge": t("msg-merge"),
                    "keep": t("msg-keep"),
                    "eat": t("msg-eat"),
                    "feed": t("msg-feed"),
                    "calcify": t("msg-calcify"),
                  }),
                },
                {
                  text: t("btn-calcified-profile"),
                  dataIndex: "calcified_profile",
                  width: 200,
                  editor: {
                    xtype: "inv.networksegmentprofile.LookupField",
                  },
                  renderer: NOC.render.Lookup("calcified_profile"),
                },
              ],
            },
            {
              name: "calcified_name_template",
              xtype: "main.template.LookupField",
              fieldLabel: t("label-calcified-name-template"),
              allowBlank: true,
            },
          ],
        },
      ],
    });
    me.callParent();
  },
});
