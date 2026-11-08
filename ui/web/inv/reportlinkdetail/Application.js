//---------------------------------------------------------------------
// inv.reportllinkdetail application
//---------------------------------------------------------------------
// Copyright (C) 2007-2016 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.reportlinkdetail.Application");

Ext.define("NOC.inv.reportlinkdetail.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.inv.networksegment.TreeCombo",
    "NOC.inv.resourcegroup.TreeCombo",
    "NOC.sa.administrativedomain.TreeCombo",
  ],

  items: {
    xtype: "report.control",
    url: "/inv/reportlinkdetail",
    controls: [
      {
        name: "segment",
        xtype: "inv.networksegment.TreeCombo",
        fieldLabel: t("header-segment-44986c"),
        listWidth: 1,
        labelWidth: 250,
        listAlign: "left",
        labelAlign: "left",
        width: 650,
      },
      {
        name: "administrative_domain",
        xtype: "sa.administrativedomain.TreeCombo",
        fieldLabel: t("label-by-adm-domain-2"),
        listWidth: 1,
        labelWidth: 250,
        listAlign: "left",
        labelAlign: "left",
        width: 650,
        allowBlank: true,
      },
      {
        name: "resource_group",
        xtype: "inv.resourcegroup.TreeCombo",
        fieldLabel: t("label-by-resource-group-selector"),
        listWidth: 1,
        labelWidth: 250,
        listAlign: "left",
        labelAlign: "left",
        width: 650,
        allowBlank: true,
      },
      {
        name: "enable_autowidth",
        xtype: "checkboxfield",
        boxLabel: t("label-enable-excel-column-autowidth"),
        allowBlank: false,
      },
    ],
    storeData: [
      ["object1_admin_domain", t("header-admin-domain-610498"), true],
      ["object1_name", t("msg-object1-name"), true],
      ["object1_address", t("msg-ip1"), true],
      ["object1_platform", t("msg-object1-platform"), false],
      ["object1_segment", t("msg-object1-segment"), false],
      ["object1_tags", t("msg-object1-tags"), false],
      ["object1_iface", t("msg-interface1"), true],
      ["object1_descr", t("msg-interface1-description"), false],
      ["object1_speed", t("msg-interface1-speed"), false],
      ["object2_admin_domain", t("header-admin-domain-610498"), true],
      ["object2_name", t("msg-object2-name"), true],
      ["object2_address", t("msg-ip2"), true],
      ["object2_platform", t("msg-object2-platform"), false],
      ["object2_segment", t("msg-object2-segment"), false],
      ["object2_tags", t("msg-object2-tags"), false],
      ["object2_iface", t("msg-interface2"), true],
      ["object2_descr", t("msg-interface2-description"), false],
      ["object2_speed", t("msg-interface2-speed"), false],
      ["link_proto", t("msg-link-proto"), true],
      ["last_seen", t("msg-link-last-seen"), false],
    ],
  },
});
