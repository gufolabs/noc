//---------------------------------------------------------------------
// sa.managedobject CPEPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.CPEPanel");

Ext.define("NOC.sa.managedobject.CPEPanel", {
  extend: "NOC.core.ApplicationPanel",
  app: null,
  autoScroll: true,
  historyHashPrefix: "cpe",

  initComponent: function(){
    var me = this;

    me.currentObject = null;

    me.refreshButton = Ext.create("Ext.button.Button", {
      text: t("help-refresh"),
      glyph: NOC.glyph.refresh,
      scope: me,
      handler: me.onRefresh,
    });

    // Create stores
    me.store = Ext.create("Ext.data.Store", {
      model: null,
      data: [],
      fields: [
        {
          name: "address",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "global_id",
          type: "string",
        },
        {
          name: "interface",
          type: "string",
        },
        {
          name: "local_id",
          type: "string",
        },
        {
          name: "location",
          type: "string",
        },
        {
          name: "mac",
          type: "string",
        },
        {
          name: "model",
          type: "string",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "serial",
          type: "string",
        },
        {
          name: "status",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
      ],
    });
    me.grid = Ext.create(
      {
        xtype: "gridpanel",
        border: false,
        autoScroll: true,
        stateful: true,
        stateId: "sa.managedobject-cpe-grid",
        store: me.store,
        columns: [
          {
            text: t("app-title-address"),
            dataIndex: "address",
          },
          {
            text: t("label-description"),
            dataIndex: "description",
          },
          {
            text: t("label-global-id"),
            dataIndex: "global_id",
          },
          {
            text: t("header-interface"),
            dataIndex: "interface",
          },
          {
            text: t("header-loca-id"),
            dataIndex: "local_id",
          },
          {
            text: t("header-location-d219c6"),
            dataIndex: "location",
          },
          {
            text: t("header-mac-2"),
            dataIndex: "mac",
          },
          {
            text: t("header-model"),
            dataIndex: "model",
          },
          {
            text: t("header-name"),
            dataIndex: "name",
          },
          {
            text: t("header-serial"),
            dataIndex: "serial",
          },
          {
            text: t("header-status"),
            dataIndex: "status",
          },
          {
            text: t("header-version"),
            dataIndex: "version",
          },
        ],
      },
    );
    //
    Ext.apply(me, {
      items: [
        me.grid,
      ],
      dockedItems: [
        {
          xtype: "toolbar",
          dock: "top",
          items: [
            me.getCloseButton(),
            me.refreshButton,
          ],
        },
      ],
    });
    me.callParent();
  },
  //
  preview: function(record){
    var me = this;
    me.callParent(arguments);
    me.setTitle(record.get("name") + " CPE");
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + record.get("id") + "/cpe/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        // Load data
        me.store.loadData(data.cpe || []);
      },
      failure: function(){
        NOC.error(t("msg-failed-to-load-data"));
      },
    });
  },
  //
  onRefresh: function(){
    var me = this;
    me.preview(me.currentRecord);
  },
});
