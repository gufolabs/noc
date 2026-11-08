//---------------------------------------------------------------------
// ip.ipam.tools form
//---------------------------------------------------------------------
// Copyright (C) 2007-2022 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.ip.ipam.view.forms.tools.ToolsForm");

Ext.define("NOC.ip.ipam.view.forms.tools.ToolsForm", {
  extend: "Ext.form.Panel",
  alias: "widget.ip.ipam.form.tools",
  controller: "ip.ipam.form.tools",
  viewModel: "ip.ipam.form.tools",
  requires: [
    "NOC.core.ComboBox",
    "NOC.ip.ipam.view.forms.tools.ToolsController",
    "NOC.ip.ipam.view.forms.tools.ToolsModel",
    "NOC.dns.dnszone.LookupField",
    "NOC.dns.dnsserver.LookupField",
  ],

  layout: "anchor",
  border: true,
  padding: 4,
  bodyPadding: 4,
  defaultType: "textfield",
  items: [
    {
      xtype: "container",
      bind: {
        html: "VRF:" + "{prefix.vrf__label} {prefix.name} " + t("msg-tools"),
      },
      padding: "0 0 4 0",
      style: {
        fontSize: "1.2em",
        fontWeight: "bold",
      },
    },
    {
      fieldLabel: t("label-ns"),
      emptyText: "Name server IP or Address",
      name: "ns",
      allowBlank: false,
      width: 300,
      bind: {
        value: "{ns}",
      },
    },
    {
      fieldLabel: t("label-zone"),
      name: "zone",
      emptyText: "DNS Zone name to transfer",
      allowBlank: false,
      width: 300,
      bind: {
        value: "{zone}",
      },
    },
    //{
    //    fieldLabel: t("Source Address"),
    //    name: "source",
    //    allowBlank: true,
    //    bind: {
    //        value: "{source}"
    //    }
    //}
  ],

  tbar: [
    {
      text: t("btn-close"),
      tooltip: t("help-close-form"),
      glyph: NOC.glyph.arrow_left,
      handler: "onClose",
    },
    "-",
    {
      text: t("btn-download"),
      tooltip: t("help-download-list-of-allocated-ip-addresses-in-csv-format"),
      glyph: NOC.glyph.download,
      handler: "onDownload",
    },
    {
      text: t("btn-start-zone-transfer"),
      tooltip: t("help-upload-list-of-allocated-ip-addresses-from-existing-dns-servers-"),
      glyph: NOC.glyph.upload,
      bind: {
        disabled: "{!isValid}",
      },
      handler: "onStartZoneTransfer",
    },
  ],
});
