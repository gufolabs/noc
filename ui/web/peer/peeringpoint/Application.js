//---------------------------------------------------------------------
// peer.peeringpoint application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.peeringpoint.Application");

Ext.define("NOC.peer.peeringpoint.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.peer.peeringpoint.Model",
    "NOC.peer.as.LookupField",
    "NOC.main.notificationgroup.LookupField",
    "NOC.sa.profile.LookupField",
  ],
  model: "NOC.peer.peeringpoint.Model",
  search: true,
  columns: [
    {
      text: t("label-fqdn"),
      flex: 1,
      dataIndex: "hostname",
    },
    {
      text: t("header-location-d219c6"),
      flex: 1,
      dataIndex: "location",
    },
    {
      text: t("header-local-as"),
      flex: 1,
      dataIndex: "local_as",
      renderer: NOC.render.Lookup("local_as"),
    },
    {
      text: t("header-router-id"),
      flex: 1,
      dataIndex: "router_id",
    },
    {
      text: t("header-profile"),
      flex: 1,
      dataIndex: "profile",
      renderer: NOC.render.Lookup("profile"),
    },
    {
      text: t("header-import-communities"),
      flex: 1,
      dataIndex: "communities",
    },
  ],
  fields: [
    {
      name: "hostname",
      xtype: "textfield",
      fieldLabel: t("label-fqdn"),
      allowBlank: false,
    },
    {
      name: "location",
      xtype: "textfield",
      fieldLabel: t("header-location-d219c6"),
    },
    {
      name: "local_as",
      xtype: "peer.as.LookupField",
      fieldLabel: t("header-local-as"),
      allowBlank: false,
    },
    {
      name: "router_id",
      xtype: "textfield",
      fieldLabel: t("header-router-id"),
      allowBlank: false,
    },
    {
      name: "profile",
      xtype: "sa.profile.LookupField",
      fieldLabel: t("header-profile"),
      allowBlank: false,
    },
    {
      name: "communities",
      xtype: "textfield",
      fieldLabel: t("header-import-communities"),
    },
    {
      name: "enable_prefix_list_provisioning",
      xtype: "checkboxfield",
      boxLabel: t("label-enable-prefix-list-provisioning"),
    },
    {
      name: "prefix_list_notification_group",
      xtype: "main.notificationgroup.LookupField",
      fieldLabel: t("label-prefix-list-notification-group"),
    },
  ],
  filters: [
    {
      title: "By Profile",
      name: "profile_name",
      ftype: "lookup",
      lookup: "sa.profile",
    },
  ],
});
