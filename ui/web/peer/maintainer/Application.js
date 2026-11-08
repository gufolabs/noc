//---------------------------------------------------------------------
// peer.maintainer application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.maintainer.Application");

Ext.define("NOC.peer.maintainer.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.MonacoPanel",
    "NOC.peer.maintainer.Model",
    "NOC.peer.person.LookupField",
    "NOC.peer.person.M2MField",
    "NOC.peer.rir.LookupField",
  ],
  model: "NOC.peer.maintainer.Model",
  search: true,
  columns: [
    {
      text: t("header-maintainer"),
      dataIndex: "maintainer",
      flex: 1,
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
      flex: 1,
    },
  ],
  fields: [
    {
      name: "maintainer",
      xtype: "textfield",
      fieldLabel: t("header-maintainer"),
      allowBlank: false,
    },
    {
      name: "description",
      xtype: "textfield",
      fieldLabel: t("label-description"),
      allowBlank: false,
    },
    {
      name: "password",
      xtype: "textfield",
      fieldLabel: t("label-password"),
      allowBlank: true,
    },
    {
      name: "rir",
      xtype: "peer.rir.LookupField",
      fieldLabel: t("app-title-rir"),
      allowBlank: false,
    },
    {
      xtype: "peer.person.M2MField",
      name: "admins",
      fieldLabel: t("label-admin-c"),
      buttons: ["add", "remove"],
      allowBlank: false,
    },
    {
      name: "extra",
      xtype: "textareafield",
      fieldLabel: t("label-extra"),
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
    previewName: "Maintainer RPSL: {0}",
    restUrl: "/peer/maintainer/{0}/repo/rpsl/",
  },
});
