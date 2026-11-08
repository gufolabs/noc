//---------------------------------------------------------------------
// ip.ipam.prefix form
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.ipam.view.forms.prefix.Prefix");

Ext.define("NOC.ip.ipam.view.forms.prefix.Prefix", {
  extend: "Ext.panel.Panel",
  alias: "widget.ip.ipam.prefix.contents",
  controller: "ip.ipam.prefix.contents",
  viewModel: "ip.ipam.prefix.contents",
  requires: [
    "Ext.layout.container.Border",
    "Ext.layout.container.Accordion",
    "NOC.ip.ipam.view.forms.Info",
    "NOC.ip.ipam.view.forms.prefix.PrefixController",
    "NOC.ip.ipam.view.forms.prefix.PrefixModel",
    "NOC.ip.ipam.view.forms.prefix.PrefixAddressLists",
  ],
  layout: "border",
  minWidth: 700,
  scrollable: true,
  items: [
    {
      region: "center",
      xtype: "ip.ipam.list.prefixAddress",
      listeners: {
        ipIPAMPrefixFormNew: "onAppendPrefix",
      },
    },
    {
      region: "east",
      xtype: "ip.ipam.info",
      width: "15%",
      split: true,
      title: t("app-title-info"),
      bind: {
        data: "{prefix}",
      },
    },
  ],
  tbar: [
    {
      text: t("btn-close"),
      tooltip: t("help-close-without-saving"),
      glyph: NOC.glyph.arrow_left,
      handler: "onClose",
    },
    "-",
    {
      text: t("btn-add-address"),
      tooltip: t("btn-add-address"),
      glyph: NOC.glyph.plus,
      handler: "onAddAddress",
      bind: {
        disabled: "{!prefix.permissions.add_address}",
      },
    },
    "-",
    {
      text: t("btn-add-prefix"),
      tooltip: t("btn-add-prefix"),
      glyph: NOC.glyph.plus,
      handler: "onAddPrefix",
      bind: {
        disabled: "{!prefix.permissions.add_prefix}",
      },
    },
    {
      text: t("btn-delete-prefix"),
      tooltip: t("btn-delete-prefix"),
      glyph: NOC.glyph.trash,
      handler: "onDeletePrefix",
      bind: {
        disabled: "{!prefix.permissions.delete_prefix}",
      },
    },
    {
      text: t("btn-edit-prefix"),
      tooltip: t("btn-edit-prefix"),
      glyph: NOC.glyph.wrench,
      handler: "onEditPrefix",
      bind: {
        disabled: "{!prefix.permissions.change}",
      },
    },
    {
      text: t("app-title-tools"),
      tooltip: t("help-open-tools"),
      glyph: NOC.glyph.edit,
      handler: "onTools",
    },
  ],
});
