//---------------------------------------------------------------------
// inv.reportifacestatus application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.reportifacestatus.Application");

Ext.define("NOC.inv.reportifacestatus.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.sa.administrativedomain.TreeCombo",
    "NOC.inv.resourcegroup.TreeCombo",
    "NOC.inv.interfaceprofile.LookupField",
  ],

  items: {
    xtype: "report.control",
    url: "/inv/reportifacestatus",
    controls: [
      {
        name: "interface_profile",
        xtype: "inv.interfaceprofile.LookupField",
        fieldLabel: t("label-by-interface-profile"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        margin: 0,
        width: 300,
        defaults: {
          padding: "0 5",
        },
      },
      {
        name: "administrative_domain",
        xtype: "sa.administrativedomain.TreeCombo",
        fieldLabel: t("label-by-adm-domain-2"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 500,
        allowBlank: true,
      },
      {
        name: "resource_group",
        xtype: "inv.resourcegroup.TreeCombo",
        fieldLabel: t("label-by-resource-group-selector"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 500,
        allowBlank: true,
      },
      {
        name: "zero",
        xtype: "checkboxfield",
        boxLabel: t("label-exclude-ports-in-the-status-down"),
        value: true,
        allowBlank: false,
      },
      {
        name: "def_profile",
        xtype: "checkboxfield",
        boxLabel: t("label-exclude-interfaces-with-the-default-name-profile-for-selector-an"),
        value: true,
        allowBlank: false,
      },
      {
        name: "enable_autowidth",
        xtype: "checkboxfield",
        boxLabel: t("label-enable-excel-column-autowidth"),
        allowBlank: false,
      },
    ],
    storeData: [
      ["object_name", t("label-object-name"), true],
      ["object_address", t("msg-ip-address"), true],
      ["object_model", t("msg-object-model"), true],
      ["object_software", t("msg-object-software"), true],
      ["object_port_name", t("msg-port-name"), true],
      ["object_port_profile_name", t("msg-port-profile-name"), true],
      ["object_port_status", t("msg-port-status"), true],
      ["object_link_status", t("msg-link-status"), true],
      ["object_port_speed", t("msg-port-speed"), true],
      ["object_port_duplex", t("msg-port-duplex"), true],
      ["object_port_untagged_vlan", t("msg-port-untagged-vlan"), false],
      ["object_port_tagged_vlans", t("msg-port-tagged-vlans"), false],
    ],
  },
});
