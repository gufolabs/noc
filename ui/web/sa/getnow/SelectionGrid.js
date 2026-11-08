//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.getnow.SelectionGrid");
Ext.define("NOC.sa.getnow.SelectionGrid", {
  extend: "Ext.grid.Panel",
  alias: "widget.selectionGrid",

  bind: {
    store: "{objectsStore}",
  },
  reference: "selectionGrid",
  border: 1,
  emptyText: t("label-not-found"),
  stateful: true,
  stateId: "getnow.selectionGrid",
  selModel: {
    mode: "MULTI",
    selType: "checkboxmodel",
  },
  columns: [
    {
      text: t("header-id"),
      tooltip: t("header-id"),
      hidden: true,
      dataIndex: "id",
      width: 60,
    },
    {
      dataIndex: "name",
      text: t("header-managed-object"),
      tooltip: t("header-managed-object"),
      width: 120,
      renderer: "onRenderTooltip",
    },
    {
      dataIndex: "profile_name",
      text: t("header-sa-profile"),
      tooltip: t("header-sa-profile"),
      width: 60,
      renderer: "onRenderTooltip",
    },
    {
      dataIndex: "last_success",
      text: t("header-last-success-2"),
      tooltip: t("header-last-success-2"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "last_update",
      text: t("header-last-update"),
      tooltip: t("header-last-update"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "status",
      text: t("header-status"),
      tooltip: t("header-status"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
    {
      dataIndex: "last_status",
      text: t("header-last-status"),
      tooltip: t("header-last-status"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
  ],
  viewConfig: {
    enableTextSelection: true,
    getRowClass: function(record){
      return record.get("status") === "R" ? "noc-status-running" : "";
    },
  },
  tbar: [
    {
      glyph: NOC.glyph.refresh,
      tooltip: t("help-reload-data"),
      handler: "onReload",
    },
    {
      text: t("btn-select-all"),
      glyph: NOC.glyph.plus_circle,
      tooltip: t("help-select-all-records-from-buffer-screen"),
      handler: "onSelectAll",
    },
    {
      text: t("btn-unselect-all"),
      glyph: NOC.glyph.minus_circle,
      bind: {
        disabled: "{!selectionGrid.selection}",
      },
      tooltip: t("btn-unselect-all"),
      handler: "onUnselectAll",
    },
    {
      text: t("app-title-reportfilter"),
      glyph: NOC.glyph.filter,
      tooltip: t("help-show-hide-filter"),
      bind: {
        pressed: "{isFilterOpen}",
      },
      handler: "onShowFilter",
    },
    {
      text: t("btn-export"),
      glyph: NOC.glyph.arrow_down,
      tooltip: t("help-export-all-records-from-buffer-screen"),
      handler: "onExport",
    },
    "->",
    {
      xtype: "box",
      bind: {
        html: t("msg-selected") + ": {total.selection}",
      },
    },
  ],
  listeners: {
    selectionchange: "onSelectionChange",
    rowdblclick: "onRowDblClick",
  },
});