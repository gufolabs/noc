//---------------------------------------------------------------------
// ip.vrf application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.vrf.Application");

Ext.define("NOC.ip.vrf.Application", {
  extend: "NOC.core.ModelApplication",
  requires: [
    "NOC.core.label.LabelField",
    "NOC.core.StateField",
    "NOC.ip.vrf.Model",
    "NOC.ip.vrfgroup.LookupField",
    "NOC.vc.vpnprofile.LookupField",
    "NOC.project.project.LookupField",
  ],
  model: "NOC.ip.vrf.Model",
  search: true,
  rowClassField: "row_class",

  initComponent: function(){
    var me = this;

    me.cardButton = Ext.create("Ext.button.Button", {
      text: t("btn-card"),
      glyph: NOC.glyph.eye,
      scope: me,
      handler: me.onCard,
    });

    Ext.apply(me, {
      columns: [
        {
          text: t("header-name"),
          dataIndex: "name",
        },
        {
          text: t("header-state"),
          dataIndex: "state",
          renderer: NOC.render.Lookup("state"),
        },
        {
          text: t("header-group"),
          dataIndex: "vrf_group",
          renderer: NOC.render.Lookup("vrf_group"),
        },
        {
          text: t("header-profile"),
          dataIndex: "profile",
          renderer: NOC.render.Lookup("profile"),
        },
        {
          text: t("label-project"),
          dataIndex: "project",
          renderer: NOC.render.Lookup("project"),
        },
        {
          text: t("header-rd"),
          dataIndex: "rd",
          width: 100,
        },
        {
          text: t("header-vpn-id"),
          dataIndex: "vpn_id",
          width: 100,
        },
        {
          text: t("choice-ipv4"),
          dataIndex: "afi_ipv4",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("choice-ipv6"),
          dataIndex: "afi_ipv6",
          renderer: NOC.render.Bool,
          width: 50,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 1,
        },
        {
          text: t("header-labels"),
          dataIndex: "labels",
          renderer: NOC.render.LabelField,
        },
      ],
      fields: [
        {
          name: "name",
          xtype: "textfield",
          fieldLabel: t("header-vrf"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "profile",
          xtype: "vc.vpnprofile.LookupField",
          fieldLabel: t("header-profile"),
          allowBlank: false,
          uiStyle: "medium",
        },
        {
          name: "vrf_group",
          xtype: "ip.vrfgroup.LookupField",
          fieldLabel: t("label-vrf-group"),
          allowBlank: true,
        },
        {
          name: "description",
          xtype: "textarea",
          fieldLabel: t("label-description"),
          allowBlank: true,
        },
        {
          name: "state",
          xtype: "statefield",
          fieldLabel: t("header-state"),
          allowBlank: false,
        },
        {
          name: "project",
          xtype: "project.project.LookupField",
          fieldLabel: t("label-project"),
          allowBlank: true,
        },
        {
          name: "rd",
          xtype: "textfield",
          fieldLabel: t("header-rd"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "vpn_id",
          xtype: "textfield",
          fieldLabel: t("header-vpn-id"),
          allowBlank: true,
          uiStyle: "medium",
        },
        {
          name: "afi_ipv4",
          xtype: "checkboxfield",
          boxLabel: t("choice-ipv4"),
          allowBlank: false,
        },
        {
          name: "afi_ipv6",
          xtype: "checkboxfield",
          boxLabel: t("choice-ipv6"),
          allowBlank: false,
        },
        {
          name: "tt",
          xtype: "textfield",
          regexText: /^\d*$/,
          fieldLabel: t("label-tt"),
          allowBlank: true,
        },
        {
          name: "labels",
          xtype: "labelfield",
          fieldLabel: t("header-labels"),
          allowBlank: true,
          query: {
            "allow_models": ["ip.VRF"],
          },
        },
        {
          name: "allocated_till",
          xtype: "datefield",
          startDay: 1,
          fieldLabel: t("label-allocated-till"),
          allowBlank: true,
        },
      ],
      formToolbar: [
        me.cardButton,
      ],
    });
    me.callParent();
  },
  //
  filters: [
    {
      title: t("app-title-by-state"),
      name: "state",
      ftype: "lookup",
      lookup: "wf.state",
    },
    {
      title: t("app-title-by-vrf-group"),
      name: "vrf_group",
      ftype: "lookup",
      lookup: "ip.vrfgroup",
    },
    {
      title: t("app-title-by-project"),
      name: "project",
      ftype: "lookup",
      lookup: "project.project",
    },
    {
      title: t("app-title-by-ipv4"),
      name: "afi_ipv4",
      ftype: "boolean",
    },
    {
      title: t("app-title-by-ipv6"),
      name: "afi_ipv6",
      ftype: "boolean",
    },
  ],
  //
  onCard: function(){
    var me = this;
    if(me.currentRecord){
      window.open(
        "/api/card/view/vrf/" + me.currentRecord.get("id") + "/",
      );
    }
  },
});
