//---------------------------------------------------------------------
// sa.managed_object LinksPanel
//---------------------------------------------------------------------
// Copyright (C) 2007-2013 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.sa.managedobject.LinksPanel");

Ext.define("NOC.sa.managedobject.LinksPanel", {
  extend: "NOC.core.ApplicationPanel",
  historyHashPrefix: "links",
  alias: "widget.sa.links",
  requires: [
    "NOC.sa.managedobject.LinksStore",
  ],
  initComponent: function(){
    var me = this;

    me.currentLink = null;

    me.refreshButton = Ext.create("Ext.button.Button", {
      text: t("help-refresh"),
      glyph: NOC.glyph.refresh,
      scope: me,
      handler: me.onRefresh,
    });

    me.store = Ext.create("NOC.sa.managedobject.LinksStore");
    me.grid = Ext.create("Ext.grid.Panel", {
      store: me.store,
      stateful: true,
      stateId: "sa.managedobject-links",
      autoScroll: true,
      columns: [
        {
          text: t("header-local-interface"),
          dataIndex: "local_interface",
          renderer: NOC.render.Lookup("local_interface"),
        },
        {
          text: t("header-local-description-2"),
          dataIndex: "local_description",
        },
        {
          text: t("header-neighbor"),
          dataIndex: "remote_object",
          renderer: NOC.render.LookupTooltip("remote_object", "{remote_platform}"),
        },
        {
          text: t("header-remote-interface"),
          dataIndex: "remote_interface",
          renderer: NOC.render.Lookup("remote_interface"),
        },
        {
          text: t("header-remote-description-987a22"),
          dataIndex: "remote_description",
        },
        {
          text: t("header-method"),
          dataIndex: "discovery_method",
        },
        {
          text: t("header-first-discovered"),
          dataIndex: "first_discovered",
        },
        {
          text: t("header-last-seen"),
          dataIndex: "last_seen",
        },
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
      listeners: {
        scope: me,
        select: me.onGridSelect,
      },
    });
    Ext.apply(me, {
      items: [
        me.grid,
      ],
    });
    me.callParent();
  },

  preview: function(record){
    var me = this;
    me.callParent(arguments);
    NOC.api.requestLegacy({
      url: "/sa/managedobject/" + record.get("id") + "/links/",
      method: "GET",
      scope: me,
      success: function(response){
        var data = Ext.decode(response.responseText);
        console.log("Links data", data);
        me.grid.setTitle(record.get("name") + " links");
        me.store.loadData(data);
      },
      failure: function(){
        NOC.error(t("msg-failed-to-get-data"));
      },
    });
  },
  //
  onGridSelect: function(grid, record){
    var me = this;
    me.currentLink = record;
  },
  //
  onRefresh: function(){
    var me = this;
    me.preview(me.currentRecord);
  },
});
