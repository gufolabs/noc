//---------------------------------------------------------------------
// ip.ipam.vrf form
//---------------------------------------------------------------------
// Copyright (C) 2007-2019 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.ipam.view.forms.vrf.VRF");

Ext.define("NOC.ip.ipam.view.forms.vrf.VRF", {
  extend: "Ext.form.Panel",
  alias: "widget.ip.ipam.form.vrf",
  controller: "ip.ipam.form.vrf",
  viewModel: "ip.ipam.form.vrf",
  requires: [
    "NOC.core.ComboBox",
    "NOC.ip.ipam.view.forms.vrf.VRFController",
    "NOC.ip.ipam.view.forms.vrf.VRFModel",
  ],
  bodyPadding: 5,
  minWidth: 700,
  scrollable: true,
  layout: "column",
  border: false,
  defaults: {
    labelAlign: "left",
    columnWidth: 0.5,
    xtype: "core.combo",
  },
  items: [
    {
      name: "name",
      xtype: "textfield",
      fieldLabel: t("header-vrf"),
      width: "100%",
      columnWidth: 1,
      allowBlank: false,
      bind: {
        value: "{vrf.name}",
      },
    },
    {
      name: "vrf_group",
      restUrl: "/ip/vrfgroup/lookup/",
      fieldLabel: t("label-vrf-group"),
      labelAlign: "left",
      margin: "5 0 0 0",
      allowBlank: true,
      bind: {
        value: "{vrf.vrf_group}",
      },
    },
    {
      name: "vpn_id",
      xtype: "textfield",
      fieldLabel: t("header-vpn-id"),
      margin: "5 0 5 5",
      bind: {
        value: "{vrf.vpn_id}",
      },
    },
    {
      name: "profile",
      restUrl: "/vc/vpnprofile/lookup/",
      fieldLabel: t("header-profile"),
      labelAlign: "left",
      allowBlank: false,
      margin: "5 0 0 0",
      bind: {
        value: "{vrf.profile}",
      },
    },
    {
      name: "rd",
      xtype: "textfield",
      fieldLabel: t("header-rd"),
      margin: "5 0 5 5",
      bind: {
        value: "{vrf.rd}",
      },
    },
    {
      name: "state",
      xtype: "statefield",
      fieldLabel: t("header-state"),
      allowBlank: false,
      restUrl: "/ip/vrf/",
      labelAlign: "left",
      bind: {
        value: "{vrf.state}",
      },
    },
    {
      name: "afi_ipv4",
      xtype: "checkboxfield",
      boxLabel: t("choice-ipv4"),
      columnWidth: 0.25,
      margin: "0 0 5 5",
      bind: {
        value: "{vrf.afi_ipv4}",
      },
    },
    {
      name: "afi_ipv6",
      xtype: "checkboxfield",
      boxLabel: t("choice-ipv6"),
      columnWidth: 0.25,
      bind: {
        value: "{vrf.afi_ipv6}",
      },
    },
    {
      name: "description",
      xtype: "textarea",
      fieldLabel: t("label-description"),
      width: "100%",
      columnWidth: 1,
      allowBlank: true,
      bind: {
        value: "{vrf.description}",
      },
    },
    {
      name: "project",
      restUrl: "/project/project/lookup/",
      fieldLabel: t("label-project"),
      columnWidth: 1,
      allowBlank: true,
      labelAlign: "left",
      margin: "5 0 0 0",
      bind: {
        value: "{vrf.project}",
      },
    },
    {
      name: "tt",
      xtype: "textfield",
      regexText: /^\d*$/,
      fieldLabel: t("label-tt"),
      margin: "5 0 5 0",
      bind: {
        value: "{vrf.tt}",
      },
    },
    {
      name: "allocated_till",
      xtype: "datefield",
      startDay: 1,
      submitFormat: "Y-m-d",
      fieldLabel: t("label-allocated-till"),
      margin: "5 0 5 5",
      bind: {
        value: "{vrf.allocated_till}",
      },
    },
    {
      name: "labels",
      xtype: "labelfield",
      width: "100%",
      fieldLabel: t("header-labels"),
      columnWidth: 1,
      allowBlank: true,
      query: {
        "allow_models": ["ip.VRF"],
      },
      bind: {
        value: "{vrf.labels}",
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
      text: t("btn-save"),
      tooltip: t("help-save-changes"),
      glyph: NOC.glyph.save,
      // formBind: true,
      handler: "onSave",
      bind: {
        disabled: "{!isSaveDisabled}",
      },
    },
  ],
});