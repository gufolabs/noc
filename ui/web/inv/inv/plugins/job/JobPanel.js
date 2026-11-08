//---------------------------------------------------------------------
// inv.inv Job Panel
//---------------------------------------------------------------------
// Copyright (C) 2007-2024 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.inv.inv.plugins.job.JobPanel");

Ext.define("NOC.inv.inv.plugins.job.JobPanel", {
  extend: "Ext.panel.Panel",
  requires: [
    "NOC.inv.inv.plugins.job.JobModel",
    "NOC.inv.inv.plugins.job.JobController",
  ],
  title: t("app-title-job"),
  closable: false,
  layout: "fit",
  scrollable: false,
  controller: "job",
  viewModel: {
    data: {
      searchText: "",
      totalCount: 0,
      currentId: undefined,
    },
  },
  tbar: [
    {
      glyph: NOC.glyph.refresh,
      tooltip: t("btn-reload"),
      handler: "onReload",
    },
    {
      xtype: "textfield",
      itemId: "searchText",
      emptyText: t("btn-search"),
      width: 400,
      bind: {
        value: "{searchText}",
      },
      listeners: {
        change: function(field, newValue){
          var grid = field.up("panel").down("gridpanel"),
            store = grid.getStore(),
            trigger = field.getTrigger("clear");
          if(newValue){
            store.filter({
              property: "name",
              value: newValue,
              anyMatch: true,
              caseSensitive: false,
            });
            trigger.show();
          } else{
            store.clearFilter();
            trigger.hide();
          }
        },
      },
      triggers: {
        clear: {
          cls: "x-form-clear-trigger",
          hidden: true,
          handler: function(field){
            field.setValue("");
            var grid = field.up("panel").down("gridpanel"),
              store = grid.getStore();
            store.clearFilter();
            field.getTrigger("clear").hide();
          },
        },
      },
    },
    "->",
    {
      xtype: "tbtext",
      style: {
        paddingRight: "20px",
      },
      bind: {
        html: t("header-total") + ": {totalCount}",
      },
    },
  ],
  items: [
    {
      xtype: "gridpanel",
      border: false,
      stateful: true,
      stateId: "inv.inv-job-grid",
      emptyText: t("label-no-jobs"),
      store: {
        model: "NOC.inv.inv.plugins.job.JobModel",
        data: [],
      },
      features: [{
        ftype: "grouping",
      }],
      scrollable: "y",
      columns: [
        {
          xtype: "glyphactioncolumn",
          width: 25,
          items: [
            {
              glyph: NOC.glyph.eye,
              tooltip: t("btn-view"),
              handler: "onViewJob",
            },
          ],
        },
        {
          text: t("header-name"),
          dataIndex: "name",
          flex: 1,
        },
        {
          text: t("label-description"),
          dataIndex: "description",
          flex: 2,
        },
        {
          text: t("btn-created-at"),
          dataIndex: "created_at",
          width: 175,
          renderer: NOC.render.DateTime,
        },
        {
          text: t("btn-completed-at"),
          dataIndex: "completed_at",
          width: 175,
          renderer: NOC.render.DateTime,
        },
        {
          text: t("header-status"),
          dataIndex: "status",
          width: 135,
          renderer: NOC.render.JobStatus,
        },
      ],
      listeners: {
        rowdblclick: "onRowDblClick",
        activate: "onActivateGrid",
      },
    },
  ],
  //
  initComponent: function(){
    this.callParent();
    let store = this.down("grid").getStore();
    store.on("datachanged", this.getController().onDataChanged, this);
  },
  //
  preview: function(data, objectId){
    var me = this,
      vm = me.getViewModel(),
      records = data.data || [],
      maskComponent = me.up("[appId=inv.inv]").maskComponent,
      messageId = maskComponent.show("processing", {name: "jobs"}),
      store = this.down("grid").getStore();
    vm.set("currentId", objectId);
    if(!Ext.isEmpty(store)){
      store.removeAll();
      store.loadData(records);
    }
    maskComponent.hide(messageId);
  },
});