//---------------------------------------------------------------------
// Copyright (C) 2007-2017 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

console.debug("Defining NOC.sa.monitor.SelectionGrid");
Ext.define("NOC.sa.monitor.SelectionGrid", {
  extend: "Ext.grid.Panel",
  alias: "widget.sa.selectionGrid",

  bind: {
    store: "{objectsStore}",
  },
  reference: "selectionGrid",
  border: 1,
  emptyText: t("label-not-found"),
  stateful: true,
  stateId: "monitor.selectionGrid",
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
      dataIndex: "address",
      text: t("label-ip-address"),
      tooltip: t("header-sa-profile"),
      width: 60,
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
      dataIndex: "b_time_start",
      text: t("header-time-start"),
      tooltip: t("header-time-start"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "b_last_success",
      text: t("header-box-last-success"),
      tooltip: t("header-box-last-success"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "b_time",
      text: t("header-box-completed-time"),
      tooltip: t("header-box-completed-time"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "b_status",
      text: t("header-box-status"),
      tooltip: t("header-box-status"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
    {
      dataIndex: "b_duration",
      text: t("header-box-duration"),
      tooltip: t("header-box-duration"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
    {
      dataIndex: "b_last_status",
      text: t("header-box-last-status"),
      tooltip: t("header-box-last-status"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
    {
      dataIndex: "p_time_start",
      text: t("header-periodic-time-start"),
      tooltip: t("header-periodic-time-start"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "p_last_success",
      text: t("header-periodic-last-success"),
      tooltip: t("header-periodic-last-success"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "p_time",
      text: t("header-periodic-completed-time"),
      tooltip: t("header-periodic-completed-time"),
      width: 40,
      renderer: "onRenderTooltip",
      sortable: false,
    },
    {
      dataIndex: "p_status",
      text: t("header-periodic-status"),
      tooltip: t("header-periodic-status"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
    {
      dataIndex: "p_duration",
      text: t("header-periodic-duration"),
      tooltip: t("header-periodic-duration"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
    {
      dataIndex: "p_last_status",
      text: t("header-periodic-last-status"),
      tooltip: t("header-periodic-last-status"),
      width: 50,
      sortable: false,
      renderer: "onRenderStatus",
    },
  ],
  tbar: [
    {
      glyph: NOC.glyph.refresh,
      tooltip: t("help-reload-data"),
      enableToggle: true,
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
    {
      xtype: "tbtext",
      bind: {
        html: "{icon}",
      },
    },
  ],
  listeners: {
    selectionchange: "onSelectionChange",
    rowdblclick: "onRowDblClick",
  },
});