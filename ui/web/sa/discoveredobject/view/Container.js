//---------------------------------------------------------------------
// sa.discoveredobject application
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.discoveredobject.view.Container");

Ext.define("NOC.sa.discoveredobject.view.Container", {
  extend: "Ext.panel.Panel",
  alias: "widget.sa.discoveredobject.container",
  controller: "sa.discoveredobject.container",
  viewModel: {
    type: "sa.discoveredobject.container",
  },
  requires: [
    "Ext.ux.form.SearchField",
    "NOC.sa.discoveredobject.controller.Container",
    "NOC.sa.discoveredobject.model.Container",
    "NOC.sa.discoveredobject.view.Grid",
    "NOC.sa.discoveredobject.view.Sidebar",
  ],
  layout: "border",
  reference: "sa-discoveredobject-list",
  tbar: [
    {
      xtype: "searchfield",
      width: 400,
      enableKeyEvents: true,
      emptyText: t("label-enter-search-text-and-press-enter"),
      triggers: {
        clear: {
          cls: "x-form-clear-trigger",
          hidden: true,
          handler: "onClearSearchField",
        },
      },
      listeners: {
        keyup: "onChangeSearchField",
      },
    },
    {
      text: t("btn-filtering-list"),
      glyph: NOC.glyph.filter,
      tooltip: t("help-show-hide-filter"),
      enableToggle: true,
      toggleHandler: "onToggleFilter",
      bind: {
        pressed: "{isFilterOpen}",
      },
    },
    {
      xtype: "splitbutton",
      text: t("btn-group-operation"),
      menu: [],
      bind: {
        disabled: "{buttonDisabled}",
      },
      listeners: {
        beforerender: "onBeforeRenderGroupAction",
      },
    },
    {
      xtype: "splitbutton",
      text: t("btn-sync-record"),
      menu: [],
      bind: {
        disabled: "{buttonDisabled}",
      },
      listeners: {
        beforerender: "onBeforeRenderSyncRecord",
      },
    },
    {
      text: t("btn-scan"),
      handler: "onScan",
    },
  ],
  items: [
    {
      region: "center",
      xtype: "sa.discoveredobject.grid",
      reference: "sa-discoveredobject-grid",
    },
    {
      xtype: "sa.discoveredobject.sidebar",
      reference: "sa-discovered-sidebar",
      region: "east",
      width: 250,
      resizable: true,
      border: false,
      animCollapse: false,
      collapseMode: "mini",
      hideCollapseTool: true,
      bind: {
        collapsed: "{!isFilterOpen}",
      },
      split: {
        xtype: "splitter",
      },
      listeners: {
        filterChanged: "onFilterChanged",
      },
    },
  ],
});
