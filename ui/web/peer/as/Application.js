//---------------------------------------------------------------------
// peer.maintainer application
//---------------------------------------------------------------------
// Copyright (C) 2007-2025 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.as.Application");

Ext.define("NOC.peer.as.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.MonacoPanel",
    "NOC.peer.as.Model",
    "NOC.peer.asprofile.LookupField",
    "NOC.peer.person.M2MField",
    "NOC.peer.maintainer.M2MField",
    "NOC.peer.rir.LookupField",
    "NOC.peer.organisation.LookupField",
    "NOC.project.project.LookupField",
  ],
  model: "NOC.peer.as.Model",
  rowClassField: "row_class",
  search: true,
  columns: [
    {
      text: t("app-title-as"),
      dataIndex: "asn",
      width: 50,
    },
    {
      text: t("header-profile"),
      dataIndex: "profile",
      width: 100,
      renderer: NOC.render.Lookup("profile"),
    },
    {
      text: t("label-description"),
      dataIndex: "description",
      flex: 1,
    },
    {
      text: t("app-title-rir"),
      dataIndex: "rir",
      renderer: NOC.render.Lookup("rir"),
      width: 100,
    },
  ],
  fields: [
    {
      name: "asn",
      xtype: "textfield",
      fieldLabel: t("app-title-as"),
      allowBlank: false,
      uiStyle: "medium",
      vtype: "ASN",
    },
    {
      name: "profile",
      xtype: "peer.asprofile.LookupField",
      fieldLabel: t("header-profile"),
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: false,
    },
    {
      name: "rir",
      xtype: "peer.rir.LookupField",
      fieldLabel: t("app-title-rir"),
      allowBlank: true,
    },
    {
      name: "project",
      xtype: "project.project.LookupField",
      fieldLabel: t("label-project"),
      allowBlank: true,
    },
    {
      name: "organisation",
      xtype: "peer.organisation.LookupField",
      fieldLabel: t("label-organisation"),
      allowBlank: true,
    },
    {
      name: "administrative_contacts",
      xtype: "peer.person.M2MField",
      fieldLabel: t("label-admin-c"),
      buttons: ["add", "remove"],
      allowBlank: true,
    },
    {
      name: "tech_contacts",
      xtype: "peer.person.M2MField",
      fieldLabel: t("label-tech-c"),
      buttons: ["add", "remove"],
      allowBlank: true,
    },
    {
      name: "maintainers",
      xtype: "peer.maintainer.M2MField",
      fieldLabel: t("app-title-maintainer"),
      buttons: ["add", "remove"],
      allowBlank: true,
    },
    {
      name: "route_maintainers",
      xtype: "peer.maintainer.M2MField",
      fieldLabel: t("label-route-maintainers"),
      buttons: ["add", "remove"],
      allowBlank: true,
    },
    {
      name: "header_remarks",
      xtype: "textarea",
      fieldLabel: t("label-header-remarks"),
      allowBlank: true,
      width: 600,
      height: 100,
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
    {
      name: "footer_remarks",
      xtype: "textarea",
      fieldLabel: t("label-footer-remarks"),
      allowBlank: true,
      width: 600,
      height: 100,
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
  ],
  preview: {
    xtype: "NOC.core.MonacoPanel",
    syntax: "rpsl",
    previewName: "AS RPSL: {0}",
    restUrl: "/peer/as/{0}/repo/rpsl/",
  },
});
