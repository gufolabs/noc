//---------------------------------------------------------------------
// ip.prefixprofile application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.prefixprofile.Application");

Ext.define("NOC.ip.prefixprofile.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.ip.prefixprofile.Model",
    "NOC.ip.addressprofile.LookupField",
    "NOC.inv.resourcepool.LookupField",
    "NOC.main.style.LookupField",
    "NOC.main.template.LookupField",
    "NOC.main.remotesystem.LookupField",
    "NOC.wf.workflow.LookupField",
  ],
  model: "NOC.ip.prefixprofile.Model",
  search: true,
  helpId: "prefix-profile",
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
          text: t("header-prefix"),
          dataIndex: "prefix_discovery_policy",
          width: 100,
          renderer: NOC.render.Choices({
            E: t("header-enabled"),
            D: t("msg-disabled"),
          }),
        },
        {
          text: t("app-title-address"),
          dataIndex: "address_discovery_policy",
          width: 100,
          renderer: NOC.render.Choices({
            E: t("header-enabled"),
            D: t("msg-disabled"),
          }),
        },
      ],

      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-name"),
          uiStyle: "medium",
          allowBlank: false,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "prefix_discovery_policy",
          xtype: "combobox",
          fieldLabel: t("label-prefix-discovery"),
          store: [
            ["E", "Enable"],
            ["D", "Disable"],
          ],
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "address_discovery_policy",
          xtype: "combobox",
          fieldLabel: t("label-address-discovery"),
          store: [
            ["E", "Enable"],
            ["D", "Disable"],
          ],
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "enable_ip_ping_discovery",
          xtype: "checkbox",
          boxLabel: t("label-ip-discovery-ping"),
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
          name: "default_address_profile",
          xtype: "ip.addressprofile.LookupField",
          fieldLabel: t("label-default-address-profile"),
          allowBlank: true,
        },
        {
          name: "seen_propagation_policy",
          xtype: "combobox",
          fieldLabel: t("label-seen-propagation"),
          allowBlank: false,
          store: [
            ["P", t("msg-propagate")],
            ["E", t("label-enable")],
            ["D", t("status-disable")],
          ],
          uiStyle: "medium",
        },
        {
          name: "prefix_special_address_policy",
          xtype: "combobox",
          tooltip: t("help-include-special-addresses-network-broadcast-for-ipv4-br-in-prefi"),
          fieldLabel: t("label-special-addresses"),
          allowBlank: false,
          store: [
            ["I", t("label-include")],
            ["X", t("label-exclude")],
          ],
          uiStyle: "medium",
          listeners: {
            render: me.addTooltip,
          },
        },
        {
          name: "pools",
          xtype: "gridfield",
          fieldLabel: t("label-address-pools"),
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
          ],
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
            "enable_prefixprofile": true,
          },
        },
      ],
    });
    me.callParent();
  },
});
