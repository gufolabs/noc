//---------------------------------------------------------------------
// peer.asset application
//---------------------------------------------------------------------
// Copyright (C) 2007-2012 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.peer.asset.Application");

Ext.define("NOC.peer.asset.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.MonacoPanel",
    "NOC.core.label.LabelField",
    "NOC.peer.asset.Model",
    "Ext.ux.form.UCField",
  ],
  model: "NOC.peer.asset.Model",
  search: true,
  columns: [
    {
      text: t("header-name"),
      flex: 1,
      dataIndex: "name",
    },
    {
      text: t("label-description"),
      flex: 1,
      dataIndex: "description",
    },
    {
      text: t("header-members"),
      flex: 1,
      dataIndex: "members",
      renderer: NOC.render.WrapColumn,
    },
    {
      text: t("header-labels"),
      flex: 1,
      dataIndex: "labels",
      renderer: NOC.render.LabelField,
    },
  ],
  fields: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-name"),
      width: 400,
      allowBlank: false,
      plugins: [ "ucfield" ],
      vtype: "ASSET",
    },
    {
      name: "description",     
      xtype: "textfield",
      fieldLabel: t("label-description"),
      width: 400,
      allowBlank: false,
    },
    {
      name: "members",
      xtype: "textareafield",
      fieldLabel: t("label-members"),
      allowBlank: true,
      width: 600,
      height: 100,
      plugins: [ "ucfield" ],
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
    {
      name: "rpsl_header",
      xtype: "textareafield",
      fieldLabel: t("label-rpsl-header"),
      allowBlank: true,
      width: 600,
      height: 100,
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
    {
      name: "rpsl_footer",
      xtype: "textareafield",
      fieldLabel: t("label-rpsl-footer"),
      allowBlank: true,
      width: 600,
      height: 100,
      fieldStyle: {
        fontFamily: "Courier",
      },
    },
    {
      name: "labels",
      xtype: "labelfield",
      fieldLabel: t("header-labels"),
      allowBlank: true,
      width: 400,
      query: {
        "enable_assetpeer": true,
      },
    },
  ],
  preview: {
    xtype: "NOC.core.MonacoPanel",
    syntax: "rpsl",
    previewName: "AS-set RPSL: {0}",
    restUrl: "/peer/asset/{0}/repo/rpsl/",
  },
});
