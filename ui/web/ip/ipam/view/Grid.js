//---------------------------------------------------------------------
// ip.ipam  application
//---------------------------------------------------------------------
// Copyright (C) 2007-2018 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.ip.ipam.view.Grid");

Ext.define("NOC.ip.ipam.view.Grid", {
  extend: "Ext.grid.Panel",
  alias: "widget.ip.ipam.grid",
  controller: "ip.ipam.GridController",
  requires: [
    "Ext.grid.feature.Grouping",
    "NOC.ip.ipam.view.GridController",
    "NOC.ip.ipam.store.VRF",
  ],
  store: {
    type: "ip.ipam",
  },
  features: [{
    ftype: "grouping",
    collapsible: true,
    // groupHeaderTpl: '{columnName}: <tpl if="{name">|{name}|{name.length}|<tpl else>"Ungrouped"</tpl>',
  }],
  columns: [
    {
      xtype: "glyphactioncolumn",
      width: 60,
      sortable: false,
      stateId: "rowaction",
      items: [
        {
          glyph: NOC.glyph.star,
          tooltip: t("help-mark-unmark"),
          getColor: function(cls, meta, r){
            return r.get("fav_status") ? NOC.colors.starred : NOC.colors.unstarred;
          },
          handler: "onFavItem",
        },
        {
          glyph: NOC.glyph.edit,
          color: NOC.colors.edit,
          tooltip: t("app-title-edit"),
          handler: "onEditItem",
        },
        {
          glyph: NOC.glyph.id_card_o,
          color: NOC.colors.edit,
          tooltip: t("help-open-card"),
          handler: "onOpenCard",
        },
      ],
    },
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
      xtype: "actioncolumn",
      text: t("choice-ipv4"),
      items: [{
        tooltip: t("help-to-see-the-prefix-contents"),
        getClass: function(v, _, record){
          return "x-fa fa-" + (record.get("afi_ipv4") ? "eye pointer-cursor" : "times default-cursor");
        },
        handler: "onViewRootPrefix4",
      }],
      width: 50,
    },
    {
      xtype: "actioncolumn",
      text: t("choice-ipv6"),
      items: [{
        tooltip: t("help-to-see-the-prefix-contents"),
        getTip: function(value, metadata, record){
          return record.get("afi_ipv6") ? t("msg-view-detail") : "";
        },
        getClass: function(v, _, record){
          return "x-fa fa-" + (record.get("afi_ipv6") ? "eye pointer-cursor" : "times default-cursor");
        },
        handler: "onViewRootPrefix6",
      }],
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
  viewConfig: {
    enableTextSelection: true,
    getRowClass: function(record){
      var c = record.get("row_class");
      if(c){
        return c;
      } else{
        return "";
      }
    },
  },
});
