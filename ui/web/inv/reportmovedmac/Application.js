// fm.reportmovedmac application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.reportmovedmac.Application");

Ext.define("NOC.inv.reportmovedmac.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.inv.networksegment.TreeCombo",
    "NOC.inv.interfaceprofile.LookupField",
    "NOC.inv.resourcegroup.TreeCombo",
    "NOC.sa.administrativedomain.TreeCombo",
  ],

  items: {
    xtype: "report.control",
    url: "/inv/reportmovedmac",
    controls: [
      {
        name: "from_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: t("btn-from"),
        allowBlank: false,
        format: "d.m.Y",
        submitFormat: "d.m.Y",
      },
      {
        name: "to_date",
        xtype: "datefield",
        startDay: 1,
        fieldLabel: t("btn-to"),
        allowBlank: false,
        format: "d.m.Y",
        submitFormat: "d.m.Y",
      },
      {
        name: "segment",
        xtype: "inv.networksegment.TreeCombo",
        fieldLabel: t("header-segment-44986c"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 500,
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
        name: "interface_profile",
        xtype: "inv.interfaceprofile.LookupField",
        fieldLabel: t("label-by-interface-profile"),
        listWidth: 1,
        listAlign: "left",
        labelAlign: "left",
        width: 500,
        allowBlank: true,
      },
      {
        name: "exclude_serial_change",
        xtype: "checkboxfield",
        boxLabel: t("label-exclude-device-if-serialnumber-changed"),
        checked: true,
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
      ["object_address", t("msg-object-address"), true],
      ["object_adm_domain", t("msg-object-adm-domain"), true],
      ["event_type", t("msg-event-type-migrate-duplicate"), true],
      ["sn_changed", t("msg-device-sn-changed-by-bi"), true],
      ["vendor_mac", t("msg-vendor-mac"), true],
      ["mac", t("header-mac"), true],
      ["migrate_ts", t("msg-migrate-ts"), true],
      ["from_iface_name", t("msg-from-interface-name"), true],
      ["from_iface_down", t("msg-from-interface-down"), true],
      ["to_iface_name", t("msg-to-interface-name"), true],
      ["to_iface_down", t("msg-to-interface-down"), true],
    ],
  },
});

