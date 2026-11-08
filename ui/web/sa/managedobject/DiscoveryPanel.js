//---------------------------------------------------------------------
// sa.managed_object DiscoveryPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.DiscoveryPanel");

Ext.define("NOC.sa.managedobject.DiscoveryPanel", {
  extend: "Ext.panel.Panel",
  alias: "widget.sa.discovery",
  app: null,
  layout: "fit",
  autoScroll: true,

  initComponent: function(){
    var me = this;

    me.closeButton = Ext.create("Ext.button.Button", {
      tooltip: t("btn-close"),
      glyph: NOC.glyph.arrow_left,
      scope: me,
      handler: me.onClose,
    });

    me.refreshButton = Ext.create("Ext.button.Button", {
      tooltip: t("help-refresh"),
      glyph: NOC.glyph.refresh,
      scope: me,
      handler: me.onRefresh,
    });

    me.runSelectedButton = Ext.create("Ext.button.Button", {
      tooltip: t("btn-run"),
      glyph: NOC.glyph.play,
      scope: me,
      disabled: true,
      handler: me.onRunSelected,
    });

    me.stopSelectedButton = Ext.create("Ext.button.Button", {
      tooltip: t("status-disable"),
      glyph: NOC.glyph.minus_circle,
      scope: me,
      disabled: true,
      handler: me.onStopSelected,
    });

    me.clipboardButton = Ext.create("Ext.button.Button", {
      tooltip: t("help-clipboard"),
      glyph: NOC.glyph.copy,
      scope: me,
      disabled: true,
      handler: function(){
        NOC.toClipboard(me.logText);
      },
    });

    me.store = Ext.create("Ext.data.Store", {
      fields: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "enable_profile",
          type: "boolean",
        },
        {
          name: "status",
          type: "string",
        },
        {
          name: "last_run",
          type: "date",
        },
        {
          name: "last_status",
          type: "string",
        },
        {
          name: "next_run",
          type: "date",
        },
        {
          name: "jcls",
          type: "string",
        },
      ],
    });

    me.grid = Ext.create("Ext.grid.Panel", {
      width: 550,
      store: me.store,
      stateful: true,
      stateId: "sa.managedobject-discovery",
      region: "west",
      split: true,
      columns: [
        {
          text: t("header-job"),
          dataIndex: "name",
          width: 120,
        },
        {
          text: t("header-profile"),
          dataIndex: "enable_profile",
          renderer: NOC.render.Bool,
          width: 40,
        },
        {
          text: t("header-status"),
          dataIndex: "status",
          width: 40,
          renderer: NOC.render.Choices({
            W: "Wait",
            R: "Run",
            S: "Stop",
            F: "Fail",
            D: "Disabled",
            s: "Suspend",
            true: "OK",
            false: "Fail",
          }),
        },
        {
          text: t("header-last-run"),
          dataIndex: "last_run",
          width: 120,
          renderer: NOC.render.DateTime,
        },
        {
          text: t("header-last-status-2"),
          dataIndex: "last_status",
          width: 40,
          renderer: NOC.render.Choices({
            W: "Wait",
            R: "Run",
            S: "Stop",
            F: "Fail",
          }),
        },
        {
          text: t("header-next-run"),
          dataIndex: "next_run",
          width: 120,
          renderer: NOC.render.DateTime,
        },
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.closeButton,
            me.refreshButton,
            "-",
            me.runSelectedButton,
            me.stopSelectedButton,
          ],
        },
      ],
      viewConfig: {
        getRowClass: Ext.bind(me.getRowClass, me),
      },
      selModel: Ext.create("Ext.selection.RowModel", {
        mode: "MULTI",
      }),
      listeners: {
        scope: me,
        selectionchange: me.onGridSelection,
      },
    });

    me.logPanel = Ext.create("Ext.panel.Panel", {
      layout: "fit",
      region: "center",
      autoScroll: true,
      flex: 1,
      items: [{
        xtype: "container",
        autoScroll: true,
        padding: 4,
      }],
      tbar: [
        me.clipboardButton,
      ],
    });

    Ext.apply(me, {
      items: [
        {
          xtype: "container",
          layout: "border",
          items: [
            me.grid,
            me.logPanel,
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  preview: function(record){
    var me = this;

    me.logPanel.items.first().update("");
    me.currentRecord = record;
    me.setTitle(record.get("name") + " discovery");
    if(me.historyHashPrefix){
      me.app.setHistoryHash(
        me.currentRecord.get("id"),
        me.historyHashPrefix,
      );
    }
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + record.get("id") + "/discovery/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        me.store.loadData(data);
      },
      failure: function(){
        NOC.error(t("msg-failed-to-load-data"));
      },
    });
  },
  //
  onClose: function(){
    var me = this;
    me.app.showForm();
  },
  //
  getRowClass: function(record){
    if(!record.get("enable_profile")){
      return "noc-inactive";
    } else if(record.get("last_status") === "F"){
      return "noc-fail";
    }
  },
  //
  onRefresh: function(){
    var me = this;
    me.preview(me.currentRecord);
  },
  //
  onRunSelected: function(){
    var me = this,
      records = me.grid.getSelectionModel().getSelection(),
      names = records.map(function(r){
        return r.get("name");
      });
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + me.currentRecord.get("id") + "/discovery/run/",
      method: "POST",
      scope: me,
      jsonData: {
        "names": names,
      },
      success: function(){
        NOC.msg.started(t("msg-job-scheduled-to-start"));
        me.onRefresh();
      },
      failure: function(){
        NOC.error(t("msg-failed-to-run-tasks"));
      },
    });
  },
  //
  onStopSelected: function(){
    var me = this,
      records = me.grid.getSelectionModel().getSelection(),
      names = records.map(function(r){
        return r.get("name");
      });
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + me.currentRecord.get("id") + "/discovery/stop/",
      method: "POST",
      scope: me,
      jsonData: {
        "names": names,
      },
      success: function(){
        me.onRefresh();
      },
      failure: function(){
        NOC.error(t("msg-failed-to-disable-tasks"));
      },
    });
  },
  //
  onGridSelection: function(selection, records){
    var me = this,
      canRun, canStop;
    canRun = records.filter(function(v){
      var status = v.get("status");
      return v.get("enable_profile") === true && (status === "W" || status === "S" || status === "" || status === "D");
    }).length > 0;
    canStop = records.filter(function(v){
      var status = v.get("status");
      return v.get("enable_profile") === true && (status === "W" || status === "");
    }).length > 0;
    me.runSelectedButton.setDisabled(!canRun);
    me.stopSelectedButton.setDisabled(!canStop);
    if(records.length === 1){
      me.showLog(records[0].get("jcls"));
    }
  },
  //
  setLog: function(text){
    var me = this;
    me.logPanel.items.first().update("<pre>" + Ext.util.Format.htmlEncode(text) + "<pre>");
  },
  //
  showLog: function(jcls){
    var me = this,
      url = "/sa/managedobject/" + me.currentRecord.get("id") + "/job_log/" + jcls + "/";
    NOC.api.requestLegacy({
      url: url,
      method: "GET",
      scope: me,
      success: function(response){
        me.setLog(response.responseText);
        me.logText = response.responseText;
        me.clipboardButton.setDisabled(false);
      },
      failure: function(){
        var text = "Failed to get job log";
        me.setLog(text);
        me.logText = text;
        me.clipboardButton.setDisabled(true);
      },
    });
  },
});
