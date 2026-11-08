//---------------------------------------------------------------------
// fm.reportalarmdetail application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.reportobjectdetail.Application");

Ext.define("NOC.sa.reportobjectdetail.Application", {
  extend: "NOC.core.Application",
  requires: [
    "NOC.core.ReportControl",
    "NOC.inv.networksegment.TreeCombo",
    "NOC.inv.resourcegroup.TreeCombo",
    "NOC.sa.administrativedomain.TreeCombo",
  ],

  items: {
    xtype: "report.control",
    url: "/sa/reportobjectdetail",
    controls: [
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
        name: "enable_autowidth",
        xtype: "checkboxfield",
        boxLabel: t("label-enable-excel-column-autowidth"),
        allowBlank: false,
      },
    ],
    storeData: [
      ["id", t("header-id"), false],
      ["object_name", t("label-object-name"), true],
      ["object_address", t("header-ip"), true],
      ["object_hostname", t("msg-object-hostname"), true],
      ["object_status", t("msg-object-status"), true],
      ["profile_name", t("header-profile"), true],
      ["object_profile", t("msg-object-profile"), false],
      ["object_vendor", t("header-vendor"), false],
      ["object_platform", t("app-title-platform"), false],
      ["object_attr_hwversion", t("btn-add-attributes-hw-version"), false],
      ["object_version", t("header-sw-version"), false],
      ["object_attr_bootprom", t("btn-add-attributes-bootprom-version"), false],
      ["object_serial", t("msg-serial-number"), false],
      ["object_attr_patch", t("btn-add-attributes-sw-patch"), false],
      ["auth_profile", t("app-title-authprofile"), false],
      ["avail", t("header-avail-389d90"), false],
      ["admin_domain", t("header-admin-domain-610498"), true],
      ["container", t("label-container-2"), false],
      ["segment", t("header-segment-44986c"), true],
      ["phys_interface_count", t("msg-physical-iface-count"), false],
      ["link_count", t("msg-link-count"), false],
      ["last_config_ts", t("msg-last-config-get-timestamp"), false],
      ["adm_path", t("msg-adm-path"), true],
      ["interface_type_count", t("msg-interface-count-by-type"), false],
      ["object_caps", t("msg-object-capabilities"), false],
      ["object_labels", t("msg-object-labels"), false],
      ["sorted_labels", t("msg-sorted-labels"), false],
      ["discovery_problem", t("app-title-sa-reportdiscoveryproblem"), false],
      ["project", t("label-project"), false],
    ],
  },
});
